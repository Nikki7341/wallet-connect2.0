import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import {
  currentGasPrice,
  initialValues,
  truncateAddress,
} from "./connectors/CommonFunctions";
import Loader from "./Loader";
import ConnectWallet, { style } from "../components/connectorCards/WalletModal";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  TextField,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { toast } from "react-toastify";
import WrongChain from "./WrongChain";

const Admin = () => {
  const { classes } = useStyles();
  const { account, provider, connector } = useWeb3React();
  const lib = provider;
  const web3 = new Web3(lib?.provider);
  const [showLoader, setShowLoader] = useState(false);
  const [openWallets, setOpenWallets] = React.useState(false);
  const [paymentData, setPaymentData] = useState(initialValues);

  return (
    <div>
      {showLoader && <Loader />}
      {openWallets && (
        <ConnectWallet handleClose={() => setOpenWallets(false)} />
      )}
      <WrongChain
        paymentData={paymentData}
        connector={connector}
        setShowLoader={setShowLoader}
      />
      <Container maxWidth={false} className={classes.mainContainder}>
        <Grid container className={classes.mainGrd}>
          <Grid item md={8} sm={10} className={classes.card}>
            <Box className={classes.hading}>
              <Typography align="center" className={classes.headingtext}>
                {account
                  ? paymentData.approvalNedded
                    ? "Document Transaction Price Details"
                    : "Whitelist / Blacklist Tokens"
                  : "Allow App to Connect to your wallet"}
              </Typography>
            </Box>
            <Box sx={{ padding: "40px" }}>
              <Box>
                {account ? (
                  <Box>
                    <TextField
                      className={classes.inputText}
                      label="Enter Token Address"
                      variant="outlined"
                    />
                  </Box>
                ) : (
                  <Box className={classes.accountNot}>
                    <Typography
                      align="center"
                      className={classes.noAccountText}
                    >
                      Click to see available wallets and {"\n"}Web3 Dapps to
                      connect
                    </Typography>
                  </Box>
                )}
                <Box>
                  <Button
                    onClick={undefined}
                    variant="contained"
                    className={classes.buttonBlack}
                  >
                    Blacklist
                  </Button>
                  <Button
                    onClick={undefined}
                    variant="contained"
                    className={classes.buttonMain}
                  >
                    Whitelist
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Admin;

export const useStyles = makeStyles()((theme) => {
  return {
    inputText: {
      width: "100%",
      margin: "20px 0",
    },
    responsiveModal: {
      ...style,
      [theme.breakpoints.down("xs")]: {
        maxWidth: "300px",
      },
    },
    noAccountText: {
      fontSize: "20px",
      fontWeight: "600",
      lineHeight: "20px",
      padding: "30px 0",
    },
    Txhash: {
      fontSize: "20px",
      fontWeight: "600",
      lineHeight: "20px",
    },
    buttonMain: {
      width: "100%",
      color: "#FFFFFF",
      marginTop: "10px",
      textTransform: "none",
      fontSize: "18px",
    },
    buttonBlack: {
      width: "100%",
      backgroundColor: "grey",
      color: "#FFF",
      marginTop: "10px",
      textTransform: "none",
      fontSize: "18px",
    },
    copyBtn: {
      padding: "0px 5px",
    },
    headingtext: {
      fontSize: "20px",
      color: "#FFFFFF",
      fontWeight: "600",
    },
    innerTExt: {
      fontSize: "18px",
      color: "#404E67",
      fontWeight: "400",
    },
    hading: {
      backgroundColor: "#00B5B8",
      width: "100%",
      padding: "15px 0",
    },
    hading2: {
      backgroundColor: "#00B5B8",
      width: "100%",
      padding: "15px 0",
      borderTopRightRadius: "12px",
      borderTopLeftRadius: "12px",
    },
    card: {
      margin: "auto",
      borderRadius: "14px",
      minWidth: "500px",
      boxShadow: "0px 4px 34px 0px rgba(0, 0, 0, 0.08)",
      [theme.breakpoints.down("xs")]: {
        minWidth: "300px",
      },
      [theme.breakpoints.between("sm", "xs")]: {
        minWidth: "350px",
      },
    },
    mainContainder: {
      paddingTop: "150px",
      width: "100%",
      height: "100vh",
    },
    mainGrd: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignContent: "center",
    },
  };
});
