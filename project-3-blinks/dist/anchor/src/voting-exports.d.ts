import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import VotingIDL from '../target/idl/voting.json';
import type { Voting } from '../target/types/voting';
export { Voting, VotingIDL };
export declare const VOTING_PROGRAM_ID: PublicKey;
export declare function getVotingProgram(provider: AnchorProvider): Program<import("@coral-xyz/anchor").Idl>;
export declare function getVotingProgramId(cluster: Cluster): PublicKey;
