import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import {
  currentGasPrice,
  initialValues,
  truncateAddress,
} from "./connectors/CommonFunctions";
import tokenDepositABI from "../ABI/tokenDeposit.json";
import boneABI from "../ABI/boneABI.json";
import fromExponential from "from-exponential";
import Loader from "./Loader";
import ConnectWallet, { style } from "../components/connectorCards/WalletModal";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Modal,
  Tooltip,
  IconButton,
  TextField,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { toast } from "react-toastify";
import WrongChain from "./WrongChain";

const Home = () => {
  const { classes } = useStyles();
  const { account, provider, connector } = useWeb3React();
  const lib = provider;
  const web3 = new Web3(lib?.provider);
  const [showLoader, setShowLoader] = useState(false);
  const [openWallets, setOpenWallets] = React.useState(false);
  const [paymentData, setPaymentData] = useState(initialValues);
  const [open, setOpen] = React.useState(false);
  const [approvalModal, setApprovalModal] = useState(false);
  const [isFinalTsx, setIsfinalTsx] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const checkAllowance = async (data) => {
    setShowLoader(true);
    try {
      const token = data.token_address;
      const instance = new web3.eth.Contract(boneABI, token);
      const allowance = Number(
        await instance.methods
          .allowance(account, data.contract_address)
          .call({ from: account }),
      );
      const symbol = await instance.methods.symbol().call();
      const tokenDecimal = Number(await instance.methods.decimals().call());
      const balance = Number(
        await instance.methods.balanceOf(account).call({ from: account }),
      );
      let approvalNedded;
      if (
        parseFloat(allowance / Math.pow(10, tokenDecimal)) >=
        parseFloat(data.doc_amount)
      ) {
        approvalNedded = false;
      } else {
        approvalNedded = true;
      }
      setPaymentData((pre) => ({
        ...pre,
        allowance,
        symbol,
        approvalNedded,
        tokenDecimal,
        balance: +balance / Math.pow(10, tokenDecimal),
      }));
      setShowLoader(false);
    } catch (err) {
      console.log(err);
      setShowLoader(false);
    }
  };

  const approveSender = async () => {
    setShowLoader(true);
    setApprovalModal(false);
    try {
      const user = account;
      const token = paymentData.token_address;
      const amount = web3.utils.toBN(
        fromExponential(
          parseFloat(paymentData.doc_amount) *
            Math.pow(10, paymentData.tokenDecimal),
        ),
      );
      const instance = new web3.eth.Contract(boneABI, token);
      const gasFee = await instance.methods
        .approve(paymentData.contract_address, amount)
        .estimateGas({ from: user });
      const encodedAbi = await instance.methods
        .approve(paymentData.contract_address, amount)
        .encodeABI();
      const CurrentgasPrice = await currentGasPrice(web3);
      await web3.eth
        .sendTransaction({
          from: user,
          to: token,
          gas: parseFloat(gasFee + 20000).toString(),
          gasPrice: CurrentgasPrice,
          data: encodedAbi,
        })
        .on("transactionHash", (res) => {
          console.log(res, "hash");
          setPaymentData((pre) => ({ ...pre, hash: res }));
        })
        .on("receipt", (res) => {
          console.log(res, "receipt");
          setShowLoader(false);
          setOpen(true);
        })
        .on("error", (res) => {
          console.log(res, "error");
          if (res.code === 4001) {
            toast.error("Transaction Denied!");
          } else {
            toast.error(res.message);
          }
          setApprovalModal(false);
          setShowLoader(false);
        });
    } catch (error) {
      console.log(error);
      setApprovalModal(false);
      setShowLoader(false);
    }
  };

  const callDepositToken = async () => {
    setShowLoader(true);
    try {
      const user = account;
      const amount = web3.utils.toBN(
        fromExponential(
          parseFloat(paymentData.doc_amount) *
            Math.pow(10, paymentData.tokenDecimal),
        ),
      );
      const instance = new web3.eth.Contract(
        tokenDepositABI,
        paymentData.contract_address,
      );
      const gasFee = await instance.methods
        .depositToken(amount)
        .estimateGas({ from: user });
      const encodedAbi = await instance.methods
        .depositToken(amount)
        .encodeABI();
      const CurrentgasPrice = await currentGasPrice(web3);
      await web3.eth
        .sendTransaction({
          from: user,
          to: paymentData.contract_address,
          gas: (parseFloat(gasFee) + 20000).toString(),
          gasPrice: CurrentgasPrice,
          data: encodedAbi,
        })
        .on("transactionHash", async (res) => {
          console.log(res, "hash");
          setPaymentData((pre) => ({ ...pre, hash: res }));
          setShowLoader(false);
          setIsfinalTsx(true);
          setOpen(true);
        })
        .on("receipt", (res) => {
          console.log(res, "receipt");
        })
        .on("error", (res) => {
          console.log(res, "error test 1");
          if (res.code === 4001) {
            toast.error("Transaction Denied!");
          } else {
            toast.error(res.message);
          }
          setShowLoader(false);
        });
    } catch (error) {
      setShowLoader(false);
      console.log(error);
    }
  };

  const handlePaymentBtn = async () => {
    if (account) {
      if (paymentData.approvalNedded) {
        setApprovalModal(true);
      } else {
        await callDepositToken();
      }
    } else {
      setOpenWallets(true);
    }
  };

  const handleSuccessPopup = () => {
    if (isFinalTsx) {
      window.location.href = paymentData.callback_url;
    } else {
      setOpen(false);
      checkAllowance(paymentData);
    }
  };

  const handleCopyClick = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(paymentData.hash);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleButton = () => {
    if (account && paymentData) {
      if (paymentData.balance < parseFloat(paymentData.doc_amount)) {
        return "Insufficient Funds";
      } else if (paymentData.approvalNedded) {
        return "Accept Amount go to Approve";
      } else {
        return "Buy Token";
      }
    } else {
      return "Connect Wallet";
    }
  };

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
                    : "Buy Token"
                  : "Allow App to Connect to your wallet"}
              </Typography>
            </Box>
            <Box sx={{ padding: "40px" }}>
              <Box>
                {account ? (
                  <Box>
                    <TextField
                      className={classes.inputText}
                      label="Enter Token Amount"
                      variant="outlined"
                    />
                  </Box>
                ) : (
                  <Box className={classes.accountNot}>
                    <Typography
                      align="center"
                      className={classes.noAccountText}
                    >
                      Click to see available wallets to connect
                    </Typography>
                  </Box>
                )}
                <Button
                  onClick={() => handlePaymentBtn()}
                  variant="contained"
                  className={classes.buttonMain}
                  disabled={handleButton() === "Insufficient Funds"}
                >
                  {handleButton()}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Modal
        open={open}
        onClose={() => handleSuccessPopup()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={classes.responsiveModal}>
          <Box className={classes.hading2}>
            <Typography align="center" className={classes.headingtext}>
              {paymentData.approvalNedded
                ? "Transaction Approved"
                : "CONGRATULATIONS !"}
            </Typography>
          </Box>
          <Grid sx={{ padding: "20px" }}>
            <Typography
              align="center"
              style={{ padding: "20px", fontSize: "15px", fontWeight: "600" }}
            >
              {paymentData.approvalNedded
                ? "Transaction Approved Successfully"
                : "Payment Submitted Successfully"}
            </Typography>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingBottom: "5px",
              }}
            >
              <Typography align="center" className={classes.Txhash}>
                {truncateAddress(paymentData.hash)}
              </Typography>
              <Tooltip title={isCopied ? "Copied!" : "Copy Hash"}>
                <IconButton
                  className={classes.copyBtn}
                  onClick={(e) => handleCopyClick()}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </div>
            <Button
              onClick={() => handleSuccessPopup()}
              variant="contained"
              className={classes.buttonMain}
            >
              Close
            </Button>
          </Grid>
        </Box>
      </Modal>
      <Modal
        open={approvalModal}
        onClose={() => setApprovalModal()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={classes.responsiveModal}>
          <Box className={classes.hading2}>
            <Typography align="center" className={classes.headingtext}>
              Approve Transaction
            </Typography>
          </Box>
          <Grid sx={{ padding: "20px" }}>
            <Typography
              align="center"
              style={{ padding: "10px", fontSize: "15px", fontWeight: "600" }}
            >
              Transaction approval needed!{" "}
            </Typography>
            <Box>
              <Typography align="center">
                Your final Approval is required to deduct The{" "}
                <b>
                  {paymentData.doc_amount} {paymentData.symbol}
                </b>{" "}
                from your wallet to Complete the transaction and submit your
                document to the Approver.
              </Typography>
            </Box>
            <Button
              onClick={() => approveSender()}
              variant="contained"
              className={classes.buttonMain}
            >
              Continue
            </Button>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default Home;

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
