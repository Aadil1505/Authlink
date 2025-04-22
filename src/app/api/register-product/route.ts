import type { NextApiRequest, NextApiResponse } from "next";
import { Connection, PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { AnchorProvider, Program, Wallet } from "@project-serum/anchor";
import fs from "fs";
import path from "path";
import idl from "@/idl/auth_product_registry.json"; // use alias if configured

const PROGRAM_ID = new PublicKey("process.env.PROGRAM_ID");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { uid, metadata } = req.body;

    if (!uid || !metadata) {
      return res.status(400).json({ error: "Missing uid or metadata" });
    }

    const walletPath = path.resolve(process.env.WALLET_PATH!);
    const keypair = Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(fs.readFileSync(walletPath, "utf-8")))
    );

    const wallet = new Wallet(keypair);
    const connection = new Connection(process.env.SOLANA_RPC!, "processed");
    const provider = new AnchorProvider(connection, wallet, {});
    const program = new Program(idl as any, PROGRAM_ID, provider);

    const [productPda] = await PublicKey.findProgramAddress(
      [Buffer.from("product"), Buffer.from(uid)],
      program.programId
    );

    const tx = await program.methods
      .registerProduct(uid, metadata)
      .accounts({
        product: productPda,
        authority: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

      console.log("herro")
    return res.status(200).json({ success: true, tx, pda: productPda.toBase58() });

  } catch (err: any) {
    console.error("Error registering product:", err);
    return res.status(500).json({ error: err.message });
  }
}