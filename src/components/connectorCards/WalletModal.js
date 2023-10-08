import React, { useState } from "react";
import { Modal, Box } from "@mui/material";
import MetaMaskCard from "./MetaMaskCard";
import WalletConnectV2Card from "./WalletConnectV2Card";
import CoinbaseWalletCard from "./CoinbaseWalletCard";
import { makeStyles } from "tss-react/mui";

export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  borderRadius: "10px",
  backgroundColor: "#FFFFFF",
  boxShadow: 24,
};

const WalletModal = ({ handleClose }) => {
  const [open, setOpen] = useState(true);
  const { classes } = useStyles();

  const onClose = () => {
    handleClose();
    setOpen(false);
  };
  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ zIndex: 9 }}
    >
      <Box className={classes.mainModal}>
        <Box>
          <MetaMaskCard />
          <WalletConnectV2Card />
          <CoinbaseWalletCard />
        </Box>
      </Box>
    </Modal>
  );
};

export default WalletModal;

export const useStyles = makeStyles()((theme) => {
  return {
    mainModal: {
      ...style,
      padding: "16px",
      [theme.breakpoints.down("xs")]: {
        maxWidth: "300px",
      },
    },
  };
});
