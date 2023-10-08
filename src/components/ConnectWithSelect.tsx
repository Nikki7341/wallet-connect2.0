import type { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import type { Web3ReactHooks } from "@web3-react/core";
import { GnosisSafe } from "@web3-react/gnosis-safe";
import type { MetaMask } from "@web3-react/metamask";
import { Network } from "@web3-react/network";
import { WalletConnect } from "@web3-react/walletconnect";
import { WalletConnect as WalletConnectV2 } from "@web3-react/walletconnect-v2";
import React, { useEffect, useState } from "react";
// @ts-ignore
import coinbaseIcon from "../assests/coinbase.svg";
// @ts-ignore
import walletConnectIcon from "../assests/walletConnect.svg";
// @ts-ignore
import metaMaskIcon from "../assests/metamask.svg";

import { CHAINS } from "./connectors/chains";
import { getName } from "./connectors/utils";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export function ConnectWithSelect({
  connector,
  activeChainId,
  chainIds = Object.keys(CHAINS).map(Number),
  isActivating,
  isActive,
  error,
  setError,
}: {
  connector:
    | MetaMask
    | WalletConnect
    | WalletConnectV2
    | CoinbaseWallet
    | Network
    | GnosisSafe;
  activeChainId: ReturnType<Web3ReactHooks["useChainId"]>;
  chainIds?: ReturnType<Web3ReactHooks["useChainId"]>[];
  isActivating: ReturnType<Web3ReactHooks["useIsActivating"]>;
  isActive: ReturnType<Web3ReactHooks["useIsActive"]>;
  error: Error | undefined;
  setError: any;
}) {
  const [desiredChainId, setDesiredChainId] = useState<any>(1);
  const [loading, setLoading] = useState({
    metamsk: false,
    coineBase: false,
    walletConnect: false,
  });
  const [isConnecting, setIsconnecting] = useState(false);
  const { classes } = useStyles();

  /**
   * When user connects eagerly (`desiredChainId` is undefined) or to the default chain (`desiredChainId` is -1),
   * update the `desiredChainId` value so that <select /> has the right selection.
   */
  useEffect(() => {
    if (activeChainId && (!desiredChainId || desiredChainId === -1)) {
      setDesiredChainId(activeChainId);
    }
  }, [desiredChainId, activeChainId]);

  console.log({
    isActivating,
    isActive,
    isConnecting,
    connection: getName(connector),
  });

  // const switchChain = useCallback(
  //   async (desiredChainId: number) => {
  //     setDesiredChainId(desiredChainId);
  //     try {
  //       if (
  //         // If we're already connected to the desired chain, return
  //         desiredChainId === activeChainId ||
  //         // If they want to connect to the default chain and we're already connected, return
  //         (desiredChainId === -1 && activeChainId !== undefined)
  //       ) {
  //         setError(undefined);
  //         return;
  //       }

  //       if (desiredChainId === -1 || connector instanceof GnosisSafe) {
  //         await connector.activate();
  //       } else if (
  //         connector instanceof WalletConnectV2 ||
  //         connector instanceof WalletConnect ||
  //         connector instanceof Network
  //       ) {
  //         await connector.activate(desiredChainId);
  //       } else {
  //         await connector.activate(getAddChainParameters(desiredChainId));
  //       }

  //       setError(undefined);
  //     } catch (error) {
  //       setError(error);
  //     }
  //   },
  //   [connector, activeChainId, setError],
  // );

  const handleClick = () => {
    setIsconnecting(true);
    if (getName(connector) === "MetaMask") {
      setLoading({ metamsk: true, coineBase: false, walletConnect: false });
    } else if (getName(connector) === "WalletConnect V2") {
      setLoading({ walletConnect: true, coineBase: false, metamsk: false });
    } else {
      setLoading({ coineBase: true, metamsk: false, walletConnect: false });
    }
    const wallet = getName(connector);
    localStorage.setItem("walletType", wallet);
    void connector
      .activate()
      .then((res) => {
        console.log(res);
        setError(undefined);
      })
      .catch((err) => {
        console.log(err);
        setIsconnecting(false);
        setError(err);
      });
  };

  const getIcon = () => {
    if (getName(connector) === "MetaMask") {
      return metaMaskIcon;
    } else if (getName(connector) === "WalletConnect V2") {
      return walletConnectIcon;
    } else {
      return coinbaseIcon;
    }
  };

  const loaderRender = () => {
    if (!error) {
      if (getName(connector) === "MetaMask") {
        return (
          <>
            {loading.metamsk && (
              <CircularProgress size={20} className={classes.loader} />
            )}
          </>
        );
      } else if (getName(connector) === "WalletConnect V2") {
        return (
          <>
            {loading.walletConnect && (
              <CircularProgress size={20} className={classes.loader} />
            )}
          </>
        );
      } else {
        return (
          <>
            {loading.coineBase && (
              <CircularProgress size={20} className={classes.loader} />
            )}
          </>
        );
      }
    }
  };

  return (
    <Button
      disabled={isConnecting}
      className={classes.mainBox}
      onClick={() => handleClick()}
    >
      <Box className={classes.iconName}>
        <img src={getIcon()} alt="icon" className={classes.icons} />
        <Box className={classes.innerText}>
          <Typography className={classes.walletName}>
            {getName(connector)}
          </Typography>
          {/* @ts-ignore */}
          {error?.message ? (
            <Typography className={classes.errormsg}>
              {error?.message}
            </Typography>
          ) : null}
        </Box>
      </Box>
      <Box>
        {/* <Status isActivating={isActivating} isActive={isActive} error={error}/>  */}
      </Box>
      <Box>{loaderRender()}</Box>
    </Button>
  );
}

export const useStyles = makeStyles()((theme) => {
  return {
    mainBox: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      cursor: "pointer",
      border: "1px solid grey",
      padding: "15px 10px",
      borderRadius: "10px",
      margin: "10px 2px",
      width: "100%",
      backgroundColor: "rgb(249, 249, 249)",
      "&:hover": {
        backgroundColor: "rgba(34, 34, 34, 0.07)",
      },
      textTransform: "none",
    },
    disableBox: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      cursor: "not-allowed",
      border: "1px solid grey",
      padding: "15px 10px",
      borderRadius: "10px",
      margin: "10px 2px",
      backgroundColor: "rgb(249, 249, 249)",
      "&:hover": {
        backgroundColor: "rgba(34, 34, 34, 0.07)",
      },
    },
    iconName: {
      display: "flex",
      flexDirection: "row",
    },
    icons: {
      height: "40px",
      width: "40px",
      borderRadius: "10px",
    },
    walletName: {
      margin: "auto 10px",
    },
    loader: {
      margin: "auto 2px",
      padding: "12px 0",
    },
    errormsg: {
      fontSize: "12px",
      color: "red",
      padding: "2px 12px",
      flexWrap: "wrap",
    },
    innerText: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    },
  };
});
