import { ethers } from "ethers";
import Contract from "../contracts/Voting.json";

// Test avec Ganache
const contractAddress = "0xc12eae2b2702bb9e6777c48f5e9FcDE96593830C";

// Test avec Ropsten
// const contractAddress = "0x4707d9fa315762F121606b8482981E76CF5cAB4f";

const getContract = async (provider) => {
  return new ethers.Contract(contractAddress, Contract.abi, provider);
};

export default getContract;
