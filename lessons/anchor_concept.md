# Anchor constraint: `close` — what it means

This document explains the `close` constraint in Anchor account validation and what it does in the context of Solana programs built with Anchor.

## What `close` does

- The `close` attribute tells Anchor to automatically close (deallocate) the indicated account at the end of the instruction and send the account's lamports (its SOL balance) to the specified beneficiary account.
- Closing an account removes its data (deallocates the account), recovers the rent-exempt lamports stored in the account, and transfers those lamports to the `close` recipient.
- This is commonly used in "delete" or "cleanup" instructions where you want to reclaim rent from an account (for example, when deleting a journal entry account).

## Example (from your code)

```rust
#[derive(Accounts)]
#[instruction(title: String)]
pub struct DeleteEntry<'info> {
    #[account( 
        mut, 
        seeds = [title.as_bytes(), owner.key().as_ref()], 
        bump, 
        close= owner,
    )]
    pub journal_entry: Account<'info, JournalEntryState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}
```

In this example, `close = owner` means: after the `DeleteEntry` instruction runs successfully, Anchor will close `journal_entry` and transfer its lamports to the `owner` account provided in the instruction.

## Important requirements and behavior

- The account being closed must be owned by the program executing the instruction (i.e., the account's owner must match the program id). Anchor enforces ownership checks for typed accounts like `Account<T>`.
- The account being closed must be marked `mut` so its lamports can be moved and its data cleared.
- The recipient (the value used with `close = ...`) must be provided in the accounts struct. It is usually a mutable account (commonly a signer) that can receive lamports. In Anchor examples you'll often see the recipient as the same `owner` Signer passed into the instruction.
- For accounts derived with seeds (PDAs): using `seeds` + `bump` ensures the correct PDA is passed. Closing a PDA is allowed — your program can deallocate PDAs it owns and transfer lamports to the beneficiary specified.

## Security considerations

- `close` is an instruction-level convenience; it does not by itself enforce higher-level authorization beyond the other account constraints you require. You must still ensure only authorized users can call the instruction that includes the `close` constraint. For example, require `owner` to be a signer or check that the signer has the authority to delete the account.
- If you rely solely on `close` with a public `owner` account, ensure the account ordering and `mut`/`signer` constraints are correct so lamports go to the intended recipient.

## Common errors when using `close`

- Attempting to close an account not owned by the program will fail (ownership mismatch).
- If the beneficiary is not provided or not mutable in the accounts list, Anchor will fail to construct the instruction.
- Trying to close an account that is still referenced elsewhere in the same instruction or by another in-flight operation can fail.

## Practical tip

Use `close` in delete-type handlers to automatically return the rent-exempt lamports to the user who created the account (or any designated recipient). It simplifies cleanup and avoids leaving orphaned accounts that hold refundable rent.
