import { Program } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';

var address = "6RMzzoy8iRv9a6ATQbxva3p5GCLFtBukjVN195aBNmQ8";
var metadata = {
    name: "voting",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Created with Anchor"
};
var instructions = [
    {
        name: "initialize_candidate",
        discriminator: [
            210,
            107,
            118,
            204,
            255,
            97,
            112,
            26
        ],
        accounts: [
            {
                name: "signer",
                writable: true,
                signer: true
            },
            {
                name: "poll",
                writable: true,
                pda: {
                    seeds: [
                        {
                            kind: "arg",
                            path: "poll_id"
                        }
                    ]
                }
            },
            {
                name: "candidate",
                writable: true,
                pda: {
                    seeds: [
                        {
                            kind: "arg",
                            path: "poll_id"
                        },
                        {
                            kind: "arg",
                            path: "candidate_name"
                        }
                    ]
                }
            },
            {
                name: "system_program",
                address: "11111111111111111111111111111111"
            }
        ],
        args: [
            {
                name: "candidate_name",
                type: "string"
            },
            {
                name: "_poll_id",
                type: "u64"
            }
        ]
    },
    {
        name: "initialize_poll",
        discriminator: [
            193,
            22,
            99,
            197,
            18,
            33,
            115,
            117
        ],
        accounts: [
            {
                name: "signer",
                writable: true,
                signer: true
            },
            {
                name: "poll",
                writable: true,
                pda: {
                    seeds: [
                        {
                            kind: "arg",
                            path: "poll_id"
                        }
                    ]
                }
            },
            {
                name: "system_program",
                address: "11111111111111111111111111111111"
            }
        ],
        args: [
            {
                name: "poll_id",
                type: "u64"
            },
            {
                name: "description",
                type: "string"
            },
            {
                name: "poll_start",
                type: "u64"
            },
            {
                name: "poll_end",
                type: "u64"
            }
        ]
    },
    {
        name: "vote",
        discriminator: [
            227,
            110,
            155,
            23,
            136,
            126,
            172,
            25
        ],
        accounts: [
            {
                name: "signer",
                signer: true
            },
            {
                name: "poll",
                pda: {
                    seeds: [
                        {
                            kind: "arg",
                            path: "poll_id"
                        }
                    ]
                }
            },
            {
                name: "candidate",
                writable: true,
                pda: {
                    seeds: [
                        {
                            kind: "arg",
                            path: "poll_id"
                        },
                        {
                            kind: "arg",
                            path: "candidate_name"
                        }
                    ]
                }
            }
        ],
        args: [
            {
                name: "_candidate_name",
                type: "string"
            },
            {
                name: "_poll_id",
                type: "u64"
            }
        ]
    }
];
var accounts = [
    {
        name: "Candidate",
        discriminator: [
            86,
            69,
            250,
            96,
            193,
            10,
            222,
            123
        ]
    },
    {
        name: "Poll",
        discriminator: [
            110,
            234,
            167,
            188,
            231,
            136,
            153,
            111
        ]
    }
];
var types = [
    {
        name: "Candidate",
        type: {
            kind: "struct",
            fields: [
                {
                    name: "candidate_name",
                    type: "string"
                },
                {
                    name: "candidate_votes",
                    type: "u64"
                }
            ]
        }
    },
    {
        name: "Poll",
        type: {
            kind: "struct",
            fields: [
                {
                    name: "poll_id",
                    type: "u64"
                },
                {
                    name: "description",
                    type: "string"
                },
                {
                    name: "poll_start",
                    type: "u64"
                },
                {
                    name: "poll_end",
                    type: "u64"
                },
                {
                    name: "candidate_amount",
                    type: "u64"
                }
            ]
        }
    }
];
var VotingIDL = {
    address: address,
    metadata: metadata,
    instructions: instructions,
    accounts: accounts,
    types: types
};

// Here we export some useful types and functions for interacting with the Anchor program.
// The programId is imported from the program IDL.
const VOTING_PROGRAM_ID = new PublicKey(VotingIDL.address);
// This is a helper function to get the Voting Anchor program.
function getVotingProgram(provider) {
    return new Program(VotingIDL, provider);
}
// This is a helper function to get the program ID for the Voting program depending on the cluster.
function getVotingProgramId(cluster) {
    switch(cluster){
        case 'devnet':
        case 'testnet':
            // This is the program ID for the Voting program on devnet and testnet.
            return new PublicKey('6RMzzoy8iRv9a6ATQbxva3p5GCLFtBukjVN195aBNmQ8');
        case 'mainnet-beta':
        default:
            return VOTING_PROGRAM_ID;
    }
}

export { VOTING_PROGRAM_ID, VotingIDL, getVotingProgram, getVotingProgramId };
