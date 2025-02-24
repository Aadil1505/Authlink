import { getUserFromDb, getUsers } from '@/lib/actions/users'
import React from 'react'

export default async function Page() {
    const user = await getUsers()
    console.log(user)
  return (
    <div>page</div>
  )
}
