"use server";

import { cookies } from "next/headers";
import { refresh } from "next/cache";
import { db } from "@/lib/db";
import { COOKIE_NAME, getActivePlayer } from "@/lib/active-player";
import { getActiveValley, VALLEY_COOKIE } from "@/lib/valley";
import { calculateTaskPoints } from "@/lib/points";
import { ensureRewardsWheel } from "@/lib/wheels";
import {
  MAX_SEGMENTS,
  MIN_SEGMENTS,
  pickWeightedIndex,
  segmentColor,
  SPIN_COST,
} from "@/lib/wheel-config";
import {
  broadcastForWeek,
  getWeekKey,
  getWeekStart,
  LOCK_IN_REWARD,
  QUESTS_TO_TUNE,
} from "@/lib/broadcast";

const PLAYER_COLORS = ["#a8e6c9", "#d3b06a", "#8fc3e8", "#d89a9a", "#b3a1e6", "#8ad8c9"];

export async function createValley(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const valley = await db.valley.create({ data: { name } });

  const cookieStore = await cookies();
  cookieStore.set(VALLEY_COOKIE, valley.id, { maxAge: 60 * 60 * 24 * 365 });
  cookieStore.delete(COOKIE_NAME);
  refresh();
}

// Pre-valley sessions carry a player cookie but no valley cookie —
// follow the player home to their valley.
export async function resumeLegacySession() {
  const cookieStore = await cookies();
  const playerId = cookieStore.get(COOKIE_NAME)?.value;
  if (!playerId) return;

  const player = await db.player.findUnique({ where: { id: playerId } });
  if (!player) return;

  cookieStore.set(VALLEY_COOKIE, player.valleyId, { maxAge: 60 * 60 * 24 * 365 });
  refresh();
}

export async function createPlayer(formData: FormData) {
  const valley = await getActiveValley();
  if (!valley) return;

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const existingCount = await db.player.count({ where: { valleyId: valley.id } });
  const player = await db.player.create({
    data: {
      valleyId: valley.id,
      name,
      color: PLAYER_COLORS[existingCount % PLAYER_COLORS.length],
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, player.id);
  refresh();
}

export async function switchPlayer(formData: FormData) {
  const playerId = String(formData.get("playerId") ?? "");
  if (!playerId) return;

  const valley = await getActiveValley();
  const player = await db.player.findUnique({ where: { id: playerId } });
  if (!valley || !player || player.valleyId !== valley.id) return;

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, playerId);
  refresh();
}

export async function addTask(formData: FormData) {
  const player = await getActivePlayer();
  if (!player) throw new Error("No active player");

  const title = String(formData.get("title") ?? "").trim();
  const minutes = Number(formData.get("minutes") ?? 0);
  const dread = Number(formData.get("dread") ?? 3);
  if (!title || minutes <= 0) return;

  const points = calculateTaskPoints(minutes, dread);

  await db.task.create({
    data: {
      playerId: player.id,
      title,
      minutes,
      dread,
      points,
    },
  });
  refresh();
}

export async function claimTask(taskId: string) {
  if (!taskId) return;

  const player = await getActivePlayer();
  if (!player) throw new Error("No active player");

  const task = await db.task.findUnique({ where: { id: taskId } });
  if (!task || task.playerId !== player.id || task.completed) return;

  await db.$transaction([
    db.task.update({
      where: { id: taskId },
      data: { completed: true, completedAt: new Date() },
    }),
    db.player.update({
      where: { id: player.id },
      data: { points: { increment: task.points } },
    }),
  ]);
  refresh();
}

export async function tuneIn() {
  const player = await getActivePlayer();
  if (!player) throw new Error("No active player");

  const week = getWeekKey();
  const weekStart = getWeekStart();

  const completedThisWeek = await db.task.count({
    where: { playerId: player.id, completed: true, completedAt: { gte: weekStart } },
  });
  if (completedThisWeek < QUESTS_TO_TUNE) {
    throw new Error("The signal isn't clear yet");
  }

  const existing = await db.broadcast.findUnique({
    where: { playerId_week: { playerId: player.id, week } },
  });
  if (existing) throw new Error("Already tuned in this week");

  const broadcast = broadcastForWeek(week);
  await db.$transaction([
    db.broadcast.create({
      data: {
        playerId: player.id,
        week,
        frequency: broadcast.frequency,
        transmission: broadcast.transmission,
      },
    }),
    db.player.update({
      where: { id: player.id },
      data: { points: { increment: LOCK_IN_REWARD } },
    }),
  ]);

  refresh();
  return { transmission: broadcast.transmission, frequency: broadcast.frequency };
}

export async function spinWheel() {
  const player = await getActivePlayer();
  if (!player) throw new Error("No active player");
  if (player.points < SPIN_COST) throw new Error("Not enough points");

  const wheel = await ensureRewardsWheel(player.valleyId);
  if (wheel.segments.length < MIN_SEGMENTS) throw new Error("The wheel is bare");

  const index = pickWeightedIndex(wheel.segments);
  const segment = wheel.segments[index];
  const netPointChange = segment.bonusPoints - SPIN_COST;

  const updated = await db.$transaction(async (tx) => {
    const updatedPlayer = await tx.player.update({
      where: { id: player.id },
      data: { points: { increment: netPointChange } },
    });
    await tx.spinLog.create({
      data: { playerId: player.id, cost: SPIN_COST, reward: segment.label },
    });
    return updatedPlayer;
  });

  refresh();
  return {
    index,
    label: segment.label,
    bonusPoints: segment.bonusPoints,
    points: updated.points,
  };
}

export async function createWheel(formData: FormData) {
  const valley = await getActiveValley();
  if (!valley) return;

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  await db.wheel.create({
    data: {
      valleyId: valley.id,
      name,
      kind: "custom",
      segments: {
        create: [0, 1, 2].map((i) => ({
          label: `Option ${i + 1}`,
          color: segmentColor(i),
          order: i,
        })),
      },
    },
  });
  refresh();
}

export async function deleteWheel(wheelId: string) {
  const valley = await getActiveValley();
  const wheel = await db.wheel.findUnique({ where: { id: wheelId } });
  if (!valley || !wheel || wheel.valleyId !== valley.id || wheel.kind === "rewards") return;
  await db.wheel.delete({ where: { id: wheelId } });
  refresh();
}

export async function addSegment(wheelId: string) {
  const valley = await getActiveValley();
  const wheel = await db.wheel.findUnique({
    where: { id: wheelId },
    include: { segments: true },
  });
  if (!valley || !wheel || wheel.valleyId !== valley.id) return;
  if (wheel.segments.length >= MAX_SEGMENTS) throw new Error("The wheel is full");

  const order = wheel.segments.length;
  await db.wheelSegment.create({
    data: {
      wheelId,
      label: "New spoke",
      color: segmentColor(order),
      order,
    },
  });
  refresh();
}

export async function updateSegment(segmentId: string, label: string, bonusPoints: number) {
  const valley = await getActiveValley();
  const segment = await db.wheelSegment.findUnique({
    where: { id: segmentId },
    include: { wheel: true },
  });
  if (!valley || !segment || segment.wheel.valleyId !== valley.id) return;

  const clean = label.trim().slice(0, 40);
  if (!clean) return;
  await db.wheelSegment.update({
    where: { id: segmentId },
    data: {
      label: clean,
      bonusPoints: Number.isFinite(bonusPoints) ? Math.max(0, Math.round(bonusPoints)) : 0,
    },
  });
  refresh();
}

export async function deleteSegment(segmentId: string) {
  const valley = await getActiveValley();
  const segment = await db.wheelSegment.findUnique({
    where: { id: segmentId },
    include: { wheel: { include: { segments: true } } },
  });
  if (!valley || !segment || segment.wheel.valleyId !== valley.id) return;
  if (segment.wheel.segments.length <= MIN_SEGMENTS) {
    throw new Error("A wheel needs at least two spokes");
  }
  await db.wheelSegment.delete({ where: { id: segmentId } });
  refresh();
}
