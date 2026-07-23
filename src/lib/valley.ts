import "server-only";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export const VALLEY_COOKIE = "starline_valley_id";

export async function getActiveValley() {
  const cookieStore = await cookies();
  const valleyId = cookieStore.get(VALLEY_COOKIE)?.value;
  if (!valleyId) return null;

  return db.valley.findUnique({ where: { id: valleyId } });
}
