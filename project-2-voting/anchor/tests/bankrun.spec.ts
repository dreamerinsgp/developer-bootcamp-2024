import { startAnchor } from "solana-bankrun";
import { BankrunProvider } from "anchor-bankrun";
import { PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { BN, Program } from "@coral-xyz/anchor";


const IDL = require("../target/idl/voting.json");
import { Voting } from '../target/types/voting';

const PUPPET_PROGRAM_ID = new PublicKey("5s3PtT8kLYCv1WEp6dSh3T7EuF35Z6jSu5Cvx4hWG79H");

describe('Create a system account', () => {

  test("bankrun", async () => {
    const context = await startAnchor("", [{name: "voting", programId: PUPPET_PROGRAM_ID}], []);
    const provider = new BankrunProvider(context);

    const puppetProgram = new Program<Voting>(
      IDL,
      provider,
    );

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from("poll"), new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
      puppetProgram.programId
    );

    // Use future timestamps: start now (0 means immediate), end in 1 year from now
    const now = Math.floor(Date.now() / 1000);
    const oneYearFromNow = now + (365 * 24 * 60 * 60); // 1 year in seconds
    
    await puppetProgram.methods.initializePoll(
      new anchor.BN(1),
        new anchor.BN(0),
        new anchor.BN(oneYearFromNow),
        "test-poll",
        "description",
    ).rpc();

    const pollAccount = await puppetProgram.account.pollAccount.fetch(pollAddress);
    console.log(pollAccount);

  });

});