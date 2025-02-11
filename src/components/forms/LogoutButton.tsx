import { signOutAction } from "@/lib/actions/auth"
import { LogOut } from "lucide-react"

export default function LogoutButton() {
  return (
    <form action={signOutAction}>
      <button type="submit" className="flex w-full items-center gap-2">
        <LogOut className="size-4" />
        Log out
      </button>
    </form>
  )
}
