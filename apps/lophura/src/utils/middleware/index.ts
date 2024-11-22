import { AuthMiddleware } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export type middlewareFunc = (
  req: NextRequest,
  res: NextResponse
) => NextResponse | Promise<NextResponse>;
const middlewares: Array<middlewareFunc> = [AuthMiddleware];

export default async function createMiddleware(
  req: NextRequest,
  res: NextResponse
) {
  for (const func of middlewares) {
    const response = await func(req, res);
    if (response) return response;
  }

  return res;
}
