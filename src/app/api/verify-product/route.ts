 import type { NextApiRequest, NextApiResponse } from 'next';
 import { Connection, PublicKey, Keypair } from '@solana/web3.js';
 import { AnchorProvider, Program, Wallet } from '@project-serum/anchor';
 import fs from 'fs';
 import path from 'path';
 import idl from '@/idl/auth_product_registry.json';
 
 const PROGRAM_ID = new PublicKey("process.env.PROGRAM_ID");
 
 type ProductAccount = {
   uid: number[];
   metadata: string;
   authority: PublicKey;
 };
 
 export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   try {
     if (req.method !== 'POST') {
       return res.status(405).json({ error: 'Method not allowed' });
     }
 
     const { uid } = req.body;
 
     if (!uid) {
       return res.status(400).json({ error: 'Missing UID' });
     }
 
     const walletPath = path.resolve(process.env.WALLET_PATH!);
     const keypair = Keypair.fromSecretKey(
       new Uint8Array(JSON.parse(fs.readFileSync(walletPath, 'utf8')))
     );
 
     const wallet = new Wallet(keypair);
     const connection = new Connection(process.env.SOLANA_RPC!, "processed");
     const provider = new AnchorProvider(connection, wallet, {});
     const program = new Program(idl as any, PROGRAM_ID, provider);
 
     const [productPda] = await PublicKey.findProgramAddress(
       [Buffer.from("product"), Buffer.from(uid)],
       program.programId
     );
 
     const account = await program.account.product.fetch(productPda) as ProductAccount;
 
     return res.status(200).json({
       success: true,
       pda: productPda.toBase58(),
       data: {
         uid: account.uid,
         metadata: account.metadata,
         authority: account.authority.toBase58(),
       }
     });
   } catch (err: any) {
     console.error("Error verifying product:", err);
     return res.status(500).json({ error: err.message });
   }
 }