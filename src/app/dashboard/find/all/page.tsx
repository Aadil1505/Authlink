import { UserTable } from "@/components/table/user-table"
import { authCheck } from "@/lib/actions/auth";
import { getUsers } from "@/lib/actions/users";
import { UserProfile } from "@/types"

export default async function UsersPage() {
  await authCheck()
  const users: UserProfile[] = await getUsers()

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-4xl font-bold mb-8">User Management</h1>
      <UserTable users={users} />
    </div>
  )
}