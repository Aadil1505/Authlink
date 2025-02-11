import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { ZodError } from "zod"
// Your own logic for dealing with plaintext password strings; be careful!
import { loginUser } from "./lib/actions/auth"
import { signInSchema } from "./lib/schema"
 
export const { handlers, signIn, signOut, auth } = NextAuth({

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = `${user.first_name} ${user.last_name}`;
        token.profile_picture = user.profile_picture
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.name = token.name
      session.user.profile_picture = token.profile_picture

      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          let user = null
 
          const { username, password } = await signInSchema.parseAsync(credentials)
 
          // logic to salt and hash password
          // logic to verify if the user exists
          user = await loginUser(username, password)
          console.log(user)
 
          if (!user) {
            console.log("user not found")
            // return null
            throw new Error("Invalid credentials.")
          }
 
          // return JSON object with the user data
          console.log("user info", user)
          return user
        } catch (error) {
          if (error instanceof ZodError) {
            console.log("Did not pass Zod parsing")
            // Return `null` to indicate that the credentials are invalid
            return null
          }
        }
      },
    }),
  ],
})