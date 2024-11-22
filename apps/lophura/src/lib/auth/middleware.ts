"use server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";

export async function AuthMiddleware(req: NextRequest, res: NextResponse) {
  const firstSetup = await isFirstSetup();

  if (firstSetup) {
    return NextResponse.redirect(new URL("/setup", req.url));
  }

  return res;
}

async function isFirstSetup() {
  const user = await db.query.users.findFirst();

  return !user;
}
