import { type Session, type User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import Models from "@/db/index";
import jwt from "jsonwebtoken";

let db = new Models();
const { User, Session, Business }: any = db;

export const authOptions: any = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      async authorize(credentials: any) {
        const user = await User.findByEmail(credentials.email);
        if (!user) {
          return null;
        }
        const isMatch = await user.matchPassword(credentials.password);
        if (!isMatch) {
          return null;
        }
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    } as any),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    } as any),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    } as any),
  ],
  callbacks: {
    async signIn({ user }: any) {
      let email = user.email;
      if (!email) return false;

      const userData = await User.findByEmail(user.email, {
        include: [
          {
            model: Business,
            required: true,
          },
        ],
      });
      if (!userData) {
        return false;
      }

      return true;
    },
    async session({ session }: { session: Session }) {
      if (!session.user) return;
      const userData = await User.findByEmail(session.user.email, {
        include: [
          {
            model: Business,
            required: true,
          },
        ],
      });
      if (!userData) {
        return null;
      }

      let userMapped = {
        id: userData.id,
        businessId: userData.businessId,
        name: userData.name,
        email: userData.email,
        rol: userData.rol,
        extra1: userData.extra1,
        extra2: userData.extra2,
        extra3: userData.extra3,
      };

      let jwtToken = jwt.sign(
        {
          businessId: userData.Business.id,
          data: userMapped,
        },
        userData.Business.coreToken,
        { expiresIn: "1h" }
      );

      return {
        jwtToken,
        business: {
          id: userData.Business.id,
          name: userData.Business.name,
          billEmail: userData.Business.billEmail,
          logo: userData.Business.logo,
          addedCard: !!userData.Business.paymentProviderToken,
          limitViews: !userData.Business.paymentProviderToken ? 5 : null,
          limitUsers: !userData.Business.paymentProviderToken ? 2 : null,
        },
        user: userMapped,
      };
    },
  },
  secret: process.env.ENCRYPTION_KEY,
  pages: {
    signIn: "/login",
  },
};
