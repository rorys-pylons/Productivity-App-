import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { VALLEY_COOKIE } from "@/lib/valley";
import { COOKIE_NAME } from "@/lib/active-player";

// The invite link: anyone who walks in with the code is in the valley.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const valley = await db.valley.findUnique({ where: { inviteCode: code } });

  if (valley) {
    const cookieStore = await cookies();
    const currentValley = cookieStore.get(VALLEY_COOKIE)?.value;
    cookieStore.set(VALLEY_COOKIE, valley.id, { maxAge: 60 * 60 * 24 * 365 });
    // Crossing into a different valley leaves the old traveler behind
    if (currentValley && currentValley !== valley.id) {
      cookieStore.delete(COOKIE_NAME);
    }
  }

  redirect("/");
}
