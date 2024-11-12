import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Authlink} from '../target/types/authlink'

describe('authlink', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Authlink as Program<Authlink>

  const authlinkKeypair = Keypair.generate()

  it('Initialize Authlink', async () => {
    await program.methods
      .initialize()
      .accounts({
        authlink: authlinkKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([authlinkKeypair])
      .rpc()

    const currentCount = await program.account.authlink.fetch(authlinkKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Authlink', async () => {
    await program.methods.increment().accounts({ authlink: authlinkKeypair.publicKey }).rpc()

    const currentCount = await program.account.authlink.fetch(authlinkKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Authlink Again', async () => {
    await program.methods.increment().accounts({ authlink: authlinkKeypair.publicKey }).rpc()

    const currentCount = await program.account.authlink.fetch(authlinkKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Authlink', async () => {
    await program.methods.decrement().accounts({ authlink: authlinkKeypair.publicKey }).rpc()

    const currentCount = await program.account.authlink.fetch(authlinkKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set authlink value', async () => {
    await program.methods.set(42).accounts({ authlink: authlinkKeypair.publicKey }).rpc()

    const currentCount = await program.account.authlink.fetch(authlinkKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the authlink account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        authlink: authlinkKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.authlink.fetchNullable(authlinkKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
