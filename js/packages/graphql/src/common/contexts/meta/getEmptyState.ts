import { MetaState } from "./types";

export const getEmptyState = (): MetaState => ({
  metadata: [],
  metadataByMint: new Map(),
  masterEditions: new Map(),
  masterEditionsByPrintingMint: new Map(),
  masterEditionsByOneTimeAuthMint: new Map(),
  metadataByMasterEdition: new Map(),
  editions: new Map(),
  auctionManagersByAuction: new Map(),
  bidRedemptions: new Map(),
  auctions: new Map(),
  auctionDataExtended: new Map(),
  vaults: new Map(),
  payoutTickets: new Map(),
  whitelistedCreatorsByCreator: new Map(),
  bidderMetadataByAuctionAndBidder: new Map(),
  bidderPotsByAuctionAndBidder: new Map(),
  safetyDepositBoxesByVaultAndIndex: new Map(),
  prizeTrackingTickets: new Map(),
  safetyDepositConfigsByAuctionManagerAndIndex: new Map(),
  bidRedemptionV2sByAuctionManagerAndWinningIndex: new Map(),
  stores: new Map(),
  creators: new Map(),
});
