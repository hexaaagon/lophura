"use server";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/lib/middleware/auth";

export type middlewareFunc = (
  req: NextRequest,
  res: NextResponse,
) => NextResponse | Promise<NextResponse>;
const middlewares: Array<middlewareFunc> = [authMiddleware];

export default async function createMiddleware(
  req: NextRequest,
  res: NextResponse,
) {
  for (const func of middlewares) {
    const response = await func(req, res);
    if (response) return response;
  }

  return res;
}
