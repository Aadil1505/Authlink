"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOutAction } from "@/lib/actions/auth";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOutAction();
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <button onClick={handleLogout} className="flex w-full items-center gap-2">
      <LogOut className="size-4" />
      Log out
    </button>
  );
}
