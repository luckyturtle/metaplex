import { Keypair, Connection, TransactionInstruction } from '@solana/web3.js';
import {
  ParsedAccount,
  SafetyDepositBox,
  sendTransactionsWithManualRetry,
  setAuctionAuthority,
  setVaultAuthority,
  TokenAccount,
} from '@oyster/common';

import { AuctionView } from '../hooks';
import { AuctionManagerStatus } from '../models/metaplex';
import { decommissionAuctionManager } from '../models/metaplex/decommissionAuctionManager';
import { unwindVault } from './unwindVault';

export async function decommAuctionManagerAndReturnPrizes(
  connection: Connection,
  wallet: any,
  auctionView: AuctionView,
  safetyDepositBoxesByVaultAndIndex: Record<
    string,
    ParsedAccount<SafetyDepositBox>
  >,
) {
  let signers: Array<Keypair[]> = [];
  let instructions: Array<TransactionInstruction[]> = [];

  if (auctionView.auctionManager.status === AuctionManagerStatus.Initialized) {
    let decomSigners: Keypair[] = [];
    let decomInstructions: TransactionInstruction[] = [];

    if (auctionView.auction.info.authority === wallet.publicKey.toBase58()) {
      await setAuctionAuthority(
        auctionView.auction.pubkey,
        wallet.publicKey.toBase58(),
        auctionView.auctionManager.pubkey,
        decomInstructions,
      );
    }
    if (auctionView.vault.info.authority === wallet.publicKey.toBase58()) {
      await setVaultAuthority(
        auctionView.vault.pubkey,
        wallet.publicKey.toBase58(),
        auctionView.auctionManager.pubkey,
        decomInstructions,
      );
    }
    await decommissionAuctionManager(
      auctionView.auctionManager.pubkey,
      auctionView.auction.pubkey,
      wallet.publicKey.toBase58(),
      auctionView.vault.pubkey,
      decomInstructions,
    );
    signers.push(decomSigners);
    instructions.push(decomInstructions);
  }

  await sendTransactionsWithManualRetry(
    connection,
    wallet,
    instructions,
    signers,
  );

  // now that is rightfully decommed, we have authority back properly to the vault,
  // and the auction manager is in disbursing, so we can unwind the vault.
  await unwindVault(
    connection,
    wallet,
    auctionView.vault,
    safetyDepositBoxesByVaultAndIndex,
  );
}
