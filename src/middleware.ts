import { withAuth } from "next-auth/middleware";

export const config = { matcher: ["/dashboard/", "/dashboard/:path*"] };

export default withAuth({
  secret: process.env.ENCRYPTION_KEY,
  // Matches the pages config in `[...nextauth]`
  pages: {
    signIn: "/login",
    error: "/error",
  },
});
