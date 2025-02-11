import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      role?: string;
      name?: string;
    } & DefaultSession["user"]
  }
  interface User {
    role?: string
    first_name?: string
    last_name?: string
    profile_picture?: string
  }
}