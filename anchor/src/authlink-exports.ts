// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import AuthlinkIDL from '../target/idl/authlink.json'
import type { Authlink } from '../target/types/authlink'

// Re-export the generated IDL and type
export { Authlink, AuthlinkIDL }

// The programId is imported from the program IDL.
export const AUTHLINK_PROGRAM_ID = new PublicKey(AuthlinkIDL.address)

// This is a helper function to get the Authlink Anchor program.
export function getAuthlinkProgram(provider: AnchorProvider) {
  return new Program(AuthlinkIDL as Authlink, provider)
}

// This is a helper function to get the program ID for the Authlink program depending on the cluster.
export function getAuthlinkProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Authlink program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg')
    case 'mainnet-beta':
    default:
      return AUTHLINK_PROGRAM_ID
  }
}
