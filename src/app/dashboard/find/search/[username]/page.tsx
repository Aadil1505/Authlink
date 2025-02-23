
import { ProfilePage } from "@/components/search/profile"
import { authCheck } from "@/lib/actions/auth"
import { getUserCertifications } from "@/lib/actions/certifications"
import { getUserTrainings } from "@/lib/actions/trainings"
import { getUserFromDb } from "@/lib/actions/users"
import { getUserVisitSummary } from "@/lib/actions/visits"
import { UserCertification, UserProfile, UserTimeStats, UserTraining } from "@/types"

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  await authCheck()
  const searchUsername = (await params).username
  const username = decodeURIComponent(searchUsername)
  const userInfo: UserProfile = await getUserFromDb(username)
  const userCertifications: UserCertification[] = userInfo && await getUserCertifications(userInfo.id)
  const userTrainings: UserTraining[] = userInfo && await getUserTrainings(userInfo.id)
  const timeStats: UserTimeStats = userInfo && await getUserVisitSummary(userInfo.id)

  return (
    <>
      <div className="flex items-center justify-center">
        {userInfo ? (
          <ProfilePage profile={userInfo} certifications={userCertifications} trainings={userTrainings} timeStats={timeStats} />
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">User Not Found</h2>
            <p className="text-muted-foreground">Sorry, we couldn&apos;t find a user with the username: {username}</p>
          </div>
        )}
      </div>
    </>
  )
}