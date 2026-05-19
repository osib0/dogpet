import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    // Fetch the session from the better-auth API endpoint
    const sessionUrl = new URL("/api/auth/get-session", request.url);
    const res = await fetch(sessionUrl, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    let session = null;
    if (res.ok) {
      session = await res.json();
    }

    // If there is no session, redirect to the access-denied page
    if (!session || !session.session) {
      return NextResponse.redirect(new URL("/access-denied", request.url));
    }
    
    // You can add further role/permission checks here if needed
    // example: if (session.user.role !== 'admin') { ... }

  } catch (error) {
    console.error("Middleware auth check failed:", error);
    // On error, fallback to denying access to be safe
    return NextResponse.redirect(new URL("/access-denied", request.url));
  }

  return NextResponse.next();
}

// Specify the paths where this middleware should run
export const config = {
  matcher: [
    // Protect the dashboard and its sub-pages
    "/dashboard/:path*",
    // Add other routes you want to protect here
  ],
};
