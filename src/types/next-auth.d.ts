import "next-auth";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role?: string;
      name?: string;
      dbId: number;
    } & DefaultSession["user"];
  }
  interface User {
    role?: string;
    first_name?: string;
    last_name?: string;
    profile_picture?: string;
    dbId: number;
  }
}
