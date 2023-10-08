import { URI_AVAILABLE } from "@web3-react/walletconnect-v2";
import React, { useEffect, useState } from "react";

import { MAINNET_CHAINS } from "../connectors/chains";
import { hooks, walletConnectV2 } from "../connectors/walletConnectV2";
import { Card } from "../connectors/Card";

const CHAIN_IDS = Object.keys(MAINNET_CHAINS).map(Number);

const {
  useChainId,
  useAccounts,
  useIsActivating,
  useIsActive,
  useProvider,
  useENSNames,
} = hooks;

export default function WalletConnectV2Card() {
  const chainId = useChainId();
  const accounts = useAccounts();
  const isActivating = useIsActivating();

  const isActive = useIsActive();

  const provider = useProvider();
  const ENSNames = useENSNames(provider);

  const [error, setError] = useState(undefined);

  useEffect(() => {
    walletConnectV2.events.on(URI_AVAILABLE, (uri: string) => {
      console.log(`uri: ${uri}`);
    });
  }, []);

  return (
    <Card
      connector={walletConnectV2}
      activeChainId={chainId}
      chainIds={CHAIN_IDS}
      isActivating={isActivating}
      isActive={isActive}
      error={error}
      setError={setError}
      accounts={accounts}
      provider={provider}
      ENSNames={ENSNames}
    />
  );
}
