import { NextResponse } from "next/server";

function isAuthorized(request) {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.startsWith("Basic ")) return false;

  const [user, pass] = atob(auth.slice(6)).split(":");
  return user === process.env.ADMIN_USERNAME && pass === process.env.ADMIN_PASSWORD;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const isAdminPage = pathname.startsWith("/admin");
  const isLikeAction = /^\/api\/tips\/[^/]+\/like$/.test(pathname) && request.method === "POST";
  const isMutatingTipsApi = pathname.startsWith("/api/tips") && request.method !== "GET" && !isLikeAction;
  const isMutatingSettingsApi = pathname.startsWith("/api/settings") && request.method !== "GET";
  const isMutatingApi = isMutatingTipsApi || isMutatingSettingsApi;

  if (!isAdminPage && !isMutatingApi) {
    return NextResponse.next();
  }

  if (isAuthorized(request)) {
    return NextResponse.next();
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Tipzeus Admin"' },
  });
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/tips/:path*", "/api/settings"],
};
