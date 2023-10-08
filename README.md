# Wallet Connect Integration with the Latest @web3-react document by Revinfotech

This readme file contains information on how you can use @web3-react/core to connect your Dapps with your wallets and establish decentralized connections and payments. It will cover connections with:

- Wallet Connect 2.0
- Metamask
- Coinbase

## Follow the Steps Below

Create a React/Next app and then add the following packages to your React/Next app using npm or yarn:

- @web3-react/core
- @web3-react/metamask
- @web3-react/walletconnect-v2
- @web3-react/coinbase-wallet
- @coinbase/wallet-sdk
- @web3-react/url
- @web3-react/types (if you are using TypeScript files or you want to build this app in TypeScript instead of JavaScript)

### Create Connector Files (.ts/.js)

1. Metamask

```typescript
import { initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";

export const [metaMask, hooks] = initializeConnector<MetaMask>(
  (actions) => new MetaMask({ actions }),
);
```

2. Wallet Connect 2.0

```typescript
import { initializeConnector } from "@web3-react/core";
import { WalletConnect as WalletConnectV2 } from "@web3-react/walletconnect-v2";

export const [walletConnectV2, hooks] = initializeConnector<WalletConnectV2>(
  (actions) =>
    new WalletConnectV2({
      actions,
      options: {
        projectId: "YOUR_PROJECT_ID", // take project id from wallet connect 2.0 Visit https://walletconnect.com/ for more information.
        chains: [1], //  by default only one mainnet chain allowed
        optionalChains: [], // you can added mainnet & testnet chains both here for ex. [1, 4, 5,96,57....]
        showQrModal: true,
      },
    }),
);
```

3. CoinBase

```typescript
import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { initializeConnector } from "@web3-react/core";

export const [coinbaseWallet, hooks] = initializeConnector<CoinbaseWallet>(
  (actions) =>
    new CoinbaseWallet({
      actions,
      options: {
        url: [], // you can added mainnet & testnet chains both here for ex. [1, 4, 5,96,57....]
        appName: "web3-react",
      },
    }),
);
```

### Next, Make Connections and Eager Connections with Hooks and Set the Provider in Your Root File

```typescript
import { hooks, metaMask } from '../../connectors/metaMask'
import { hooks, walletConnectV2 } from '../../connectors/walletConnectV2'
import { coinbaseWallet, hooks } from '../../connectors/coinbaseWallet'

const handleConnect = (metaMask || walletConnectV2 || coinbaseWallet) => { // you can get connecter from the above example
 void connector
      .activate()
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      });
}

```

### The Final Step - Set the Provider and Eagerly Connect in the Main app.js File

```typescript
import React from 'react';
import type { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import type { MetaMask } from '@web3-react/metamask'
import type { Network } from '@web3-react/network'
import type { WalletConnect } from '@web3-react/walletconnect'
import type { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'
import { coinbaseWallet, hooks as coinbaseWalletHooks } from '../connectors/coinbaseWallet'
import { hooks as metaMaskHooks, metaMask } from '../connectors/metaMask'
import { hooks as networkHooks, network } from '../connectors/network'
import { hooks as walletConnectHooks, walletConnect } from '../connectors/walletConnect'
import { hooks as walletConnectV2Hooks, walletConnectV2 } from '../connectors/walletConnectV2'
import useEgarConnect from "../connectors/useEgarlyConnect"

const connectors: [MetaMask | WalletConnect | WalletConnectV2 | CoinbaseWallet | Network, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
  [walletConnectV2, walletConnectV2Hooks],
  [coinbaseWallet, coinbaseWalletHooks],
  [network, networkHooks],
]

export default function Web3ProviderNew({children}:any) {
  useEgarConnect()
  return (
    <Web3ReactProvider connectors={connectors}>
      {children}
    </Web3ReactProvider>
  )
}
```

## useEagerConnect Code - Mainly for Auto-Connecting Wallets on Page Reload

```typescript
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
  console.log({ walletType });
  if (walletType === "MetaMask") {
    connect(metaMask, walletType);
  } else if (walletType === "WalletConnect V2") {
    connect(walletConnectV2, walletType);
  } else if (walletType === "Coinbase Wallet") {
    connect(coinbaseWallet, walletType);
  }
}
```

## Your app.js File Will Look Like This

```typescript

export default function App() {
  return (
    <>
      <NewWeb3Provider>
          <BrowserRouter>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
      </NewWeb3Provider>
    </>
  );
}

```

## HOME.js

```typescript
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";

  const { account, provider } = useWeb3React();
  const lib = provider;
  const web3 = new Web3(lib?.provider);

const instance = new web3.eth.Contract('JOSN ABI', 'CONTRACT_ADDRESS);
const contract_instance = new web3.eth.Contract('JOSN ABI', 'CONTRACT_ADDRESS');

const getBalance = async ()  => {
  const balance = await instance.methods.balanceOf(account).call({ from: account })
  console.log(balance);
}

```

### NOTE

This is just a demo for connecting wallets to make transactions. You can refer to the above repository code. I will add the latest version of web3.js documentation for contract interaction soon, as it's almost the same.
