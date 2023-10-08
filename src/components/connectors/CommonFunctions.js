import Web3 from "web3";
import bigInt from "big-integer";

export const truncateAddress = (address) => {
  if (!address) return "No Account";
  const match = address.match(
    /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/,
  );
  if (!match) return address;
  return address.slice(0, 6) + "..." + address.slice(-5);
};

export const toHex = (num) => {
  const val = Number(num);
  return "0x" + val.toString(16);
};

export const currentGasPrice = async (web3) => {
  let value;
  await web3.eth
    .getGasPrice()
    .then((res) => {
      value = parseInt(res * 1.1);
    })
    .catch((err) => {});
  return value;
};

export const handleBigInt = (value) => {
  const web3 = new Web3();
  const weiValue = bigInt(value);
  const etherValue = web3.utils.fromWei(weiValue.toString(), "ether");
  const etherValueAsNumber = parseFloat(etherValue);
  return etherValueAsNumber;
};

export const initialValues = {
  contract: "",
  chainID: 97,
  tokenAddress: "",
  token_network: "BNB testnet",
};
