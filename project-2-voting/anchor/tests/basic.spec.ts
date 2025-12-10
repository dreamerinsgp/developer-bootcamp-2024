import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Voting } from '../target/types/voting';
import { PublicKey } from '@solana/web3.js';

describe('Voting', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Voting as Program<Voting>;

  it('initializePoll', async () => {

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from("poll"), new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    // Use future timestamps: start now (0 means immediate), end in 1 year from now
    const now = Math.floor(Date.now() / 1000);
    const oneYearFromNow = now + (365 * 24 * 60 * 60); // 1 year in seconds
    
    const tx = await program.methods.initializePoll(
        new anchor.BN(1),
        new anchor.BN(0),
        new anchor.BN(oneYearFromNow),
        "test-poll",
        "description",
    )
    .rpc();

    console.log('Your transaction signature', tx);
  });

  it('initialize candidates', async () => {
    const pollIdBuffer = new anchor.BN(1).toArrayLike(Buffer, "le", 8)

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from("poll"), pollIdBuffer],
      program.programId
    );

    const smoothTx = await program.methods.initializeCandidate(
      new anchor.BN(1), 
      "smooth",
    ).accounts({
      pollAccount: pollAddress
    })
    .rpc();

    const crunchyTx = await program.methods.initializeCandidate(
      new anchor.BN(1), 
      "crunchy",
    ).accounts({
      pollAccount: pollAddress
    })
    .rpc();

    console.log('Your transaction signature', smoothTx);
  });

  it('vote', async () => {

    const tx = await program.methods.vote(
      new anchor.BN(1),
      "smooth",
    )
    .rpc();

    console.log('Your transaction signature', tx);
  });
});
