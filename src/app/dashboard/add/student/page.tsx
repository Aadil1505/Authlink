import { authCheck } from "@/lib/actions/auth";

export default async function Page() {
    await authCheck()
  return (
    <div className="container mx-auto py-10">
      {/* <StudentForm /> */}
    </div>
  )
}

