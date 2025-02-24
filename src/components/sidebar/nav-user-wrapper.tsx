import { auth } from '@/auth'
import { NavUser } from './nav-user'

// This is a wrapper for the NavUser sidebar component which 
// enables usage of auth.js's server side authentication functions

export default async function NavUserWrapper() {
    const session = await auth()

  return (
    <NavUser user={{
        name: session?.user.name,
        email: session?.user.email,
        avatar: session?.user.profile_picture
      }}/>
  )
}
