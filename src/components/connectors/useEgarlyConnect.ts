import { coinbaseWallet } from "./coinbaseWallet";
import { metaMask } from "./metaMask";
import { walletConnectV2 } from "./walletConnectV2";
import { Connector } from "@web3-react/types";

async function connect(connector: Connector, wallet: String) {
  try {
    if (connector.connectEagerly) {
      console.log("connecting egarly =>" + wallet);
      await connector.connectEagerly();
    } else {
      console.log("connecting active from egarly =>" + wallet);
      await connector.activate();
    }
  } catch (error) {
    console.debug(`web3-react eager connection error from ${wallet}: ${error}`);
  }
}

export default function useEgarlyConnect() {
  const walletType =
    localStorage.getItem("walletType") || "no connection found";
  if (walletType === "MetaMask") {
    connect(metaMask, walletType);
  } else if (walletType === "WalletConnect V2") {
    connect(walletConnectV2, walletType);
  } else if (walletType === "Coinbase Wallet") {
    connect(coinbaseWallet, walletType);
  }
}
