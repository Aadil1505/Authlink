import { auth } from "@/auth";
import LogoutButton from "@/components/forms/LogoutButton";
import { redirect } from "next/navigation";

export default async function Home() {

    const session = await auth()
    if (!session?.user) return redirect("/login")

  return (
    <div>
      <p>hello {session.user.email}</p>
      <LogoutButton/>
    </div>
  );
}
