import { Button } from "@/components/ui/button"
import { authCheck } from "@/lib/actions/auth"
import Link from 'next/link'

export default async function Home() {

  await authCheck()

  return (
    <>
      {/* Hero */}
      <div className="flex items-center justify-center">
        <div className="container py-24 lg:py-32">
          {/* Title */}
          <div className="mt-5 max-w-2xl text-center mx-auto">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Authlink
            </h1>
          </div>
          {/* End Title */}
          <div className="mt-5 max-w-3xl text-center mx-auto">
            <p className="text-xl text-muted-foreground">
            View your prdocut history or start a new Verification!.
            </p>
          </div>
          {/* Buttons */}
          <div className="mt-8 gap-3 flex justify-center">
            {/* SEARCH BUTTON */}
            <Button variant={"outline"} asChild>
              <Link href="/dashboard/find/search">Search</Link>
            </Button>
          </div>
        </div>
      </div>
      {/* End Hero */}
    </>
  )
}
