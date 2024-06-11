"use client";
import { signOut } from "next-auth/react";

export default async function LogoutPage({}) {
  const logout = () => {
    signOut({ callbackUrl: "/login" });
  };

  logout();
}
