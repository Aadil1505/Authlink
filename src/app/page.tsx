import { auth } from "@/auth";
import { redirect } from "next/navigation";
import UserDashboard from "@/components/UserDashboard";

export default async function Home() {
    const session = await auth();
    if (!session?.user) return redirect("/login");

    // Redirect all users to the UserDashboard
    return <UserDashboard />;
}
