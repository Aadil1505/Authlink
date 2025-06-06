"use server";

import { auth, signIn, signOut } from "@/auth";
import bcrypt from "bcrypt";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { getUserFromDb } from "./users";

// HASH PASSWORD WITH BCRYPT
export async function hashPassword(password: string) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);

  const newpass = await bcrypt.hash(password, salt);
  return newpass;
}

// VERIFY PASSWORD WITH BCRYPT COMPARE
export async function verifyPassword(password: string, hashPassword: string) {
  const result = await bcrypt.compare(password, hashPassword);
  return result;
}

// NextAuth sign in action
export async function signInAction(formData: FormData) {
  try {
    await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false, // Handle redirect manually after successful authentication
    });

    return {
      success: true,
      response: "Login successful",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            response: "Invalid credentials.",
          };
        default:
          return {
            success: false,
            response: "Something went wrong during authentication.",
          };
      }
    }

    return {
      success: false,
      response: "An unexpected error occurred.",
    };
  }
}

// NEXTAUTH FUNCTIONALITY TO LOGIN THE USER
export async function loginUser(identifier: string, password: string) {
  try {
    // First retrieve the user
    const user = await getUserFromDb(identifier);

    if (!user) {
      console.log("No user found during login attempt");
      return null;
    }

    // Verify the password
    const isPasswordValid = await verifyPassword(password, user.password_hash);

    if (!isPasswordValid) {
      return null;
    }

    console.log("User successfully authenticated:", {
      email: user.email,
      role: user.role,
    });

    // Return user object without password_hash for security
    // const { password_hash, ...userWithoutPassword } = user;
    return user;
  } catch (error) {
    console.error("Error during login:", error);
    return null;
  }
}

// Redirect user to login page if they are unauthenticated
export async function authCheck() {
  const session = await auth();
  // console.log(session?.user)
  if (!session?.user) {
    console.log("Not authenticated");
    return redirect("/login");
  }
  return session.user;
}

// Action to signout user
export async function signOutAction() {
  "use server";
  await signOut();
  redirect("/login");
}
