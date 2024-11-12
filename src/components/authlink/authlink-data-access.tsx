'use client'

import {getAuthlinkProgram, getAuthlinkProgramId} from '@project/anchor'
import {useConnection} from '@solana/wallet-adapter-react'
import {Cluster, Keypair, PublicKey} from '@solana/web3.js'
import {useMutation, useQuery} from '@tanstack/react-query'
import {useMemo} from 'react'
import toast from 'react-hot-toast'
import {useCluster} from '../cluster/cluster-data-access'
import {useAnchorProvider} from '../solana/solana-provider'
import {useTransactionToast} from '../ui/ui-layout'

export function useAuthlinkProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getAuthlinkProgramId(cluster.network as Cluster), [cluster])
  const program = getAuthlinkProgram(provider)

  const accounts = useQuery({
    queryKey: ['authlink', 'all', { cluster }],
    queryFn: () => program.account.authlink.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['authlink', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ authlink: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useAuthlinkProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useAuthlinkProgram()

  const accountQuery = useQuery({
    queryKey: ['authlink', 'fetch', { cluster, account }],
    queryFn: () => program.account.authlink.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['authlink', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ authlink: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['authlink', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ authlink: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['authlink', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ authlink: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['authlink', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ authlink: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
