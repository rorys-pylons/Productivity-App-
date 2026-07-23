import "server-only";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { VALLEY_COOKIE } from "@/lib/valley";

const COOKIE_NAME = "sidequest_player_id";

// A player is only "active" inside their own valley — a stale player cookie
// from another valley reads as no player at all.
export async function getActivePlayer() {
  const cookieStore = await cookies();
  const playerId = cookieStore.get(COOKIE_NAME)?.value;
  const valleyId = cookieStore.get(VALLEY_COOKIE)?.value;
  if (!playerId || !valleyId) return null;

  const player = await db.player.findUnique({ where: { id: playerId } });
  if (!player || player.valleyId !== valleyId) return null;
  return player;
}

export { COOKIE_NAME };
