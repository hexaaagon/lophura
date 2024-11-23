import { NextRequest } from "next/server";

export async function authMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
}
