#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod authlink {
    use super::*;

  pub fn close(_ctx: Context<CloseAuthlink>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.authlink.count = ctx.accounts.authlink.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.authlink.count = ctx.accounts.authlink.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeAuthlink>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.authlink.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeAuthlink<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Authlink::INIT_SPACE,
  payer = payer
  )]
  pub authlink: Account<'info, Authlink>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseAuthlink<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub authlink: Account<'info, Authlink>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub authlink: Account<'info, Authlink>,
}

#[account]
#[derive(InitSpace)]
pub struct Authlink {
  count: u8,
}
