import { withAuth } from "next-auth/middleware";

export const config = { matcher: ["/dashboard/", "/dashboard/:path*"] };

export default withAuth({
  secret: process.env.ENCRYPTION_KEY,
  pages: {
    signIn: "/login",
    error: "/error",
  },
});
