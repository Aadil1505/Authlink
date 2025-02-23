import { SearchBar } from "@/components/forms/Search"
import { authCheck } from "@/lib/actions/auth"

export default async function Page() {
  await authCheck()
  return (
    <div className="relative overflow-hidden">
      <div className="container py-24 lg:py-32">
        <div className="text-center">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Search for a Maker!</h1>
          <p className="mt-3 text-xl text-muted-foreground">Search by h700 number, MakerID, or pride email.</p>
          <div className="mt-7 sm:mt-12 mx-auto max-w-xl relative">
            <SearchBar />
          </div>
        </div>
      </div>
    </div>
  )
}

