import { auth } from "@/auth";
import SignupForm from "@/components/forms/Signup";
import { redirect } from "next/navigation";

export default async function SignupPage() {

    const session = await auth()
    if (session?.user) {
      if (session?.user.role==="manufacturer") return redirect("/dashboard")
      if (session?.user.role!=="product_owner") return redirect("/")
    }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  )
}
