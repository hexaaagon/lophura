"use server";
import { NextRequest, NextResponse } from "next/server";
import { edgeApi } from "../trpc/edge";
import { cookies } from "next/headers";

export async function authMiddleware(req: NextRequest, res: NextResponse) {
  const cookieStore = await cookies();
  const isFirstInstall = (await edgeApi.auth.getUserCount.mutate()) === 0;

  const isLoggedIn = cookieStore.get(
    await edgeApi.auth.edge.getSessionCookieName.query(),
  )?.value;

  const path = req.nextUrl.pathname;

  if (isFirstInstall && path !== "/setup") {
    return NextResponse.redirect(new URL("/setup", req.url));
  } else if (!isFirstInstall && path === "/setup") {
    return isLoggedIn
      ? NextResponse.redirect(new URL("/home", req.url))
      : NextResponse.redirect(new URL("/", req.url));
  }

  if (isLoggedIn && path === "/")
    return NextResponse.redirect(new URL("/home", req.url));

  return res;
}
