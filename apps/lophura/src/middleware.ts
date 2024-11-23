import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "./lib/middleware";

export async function middleware(request: NextRequest) {
  // Create an unmodified response
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  return createMiddleware(request, response);
}

export const config = {
  matcher:
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|static).*)",
};
