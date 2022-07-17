import { ethers } from "ethers";
import Contract from "../contracts/Voting.json";

const { NODE_ENV } = process.env;
console.log(`NODE_ENV : ${NODE_ENV}`);

// Local Ganache contract address
let contractAddress = "0xc12eae2b2702bb9e6777c48f5e9fcde96593830c";

if (NODE_ENV === "production") {
  // Ropsten contract address
  contractAddress = "0x25894FC05072d05721379CF9BE09Df345CF2665b";
}

const getContract = async (provider) => {
  return new ethers.Contract(contractAddress, Contract.abi, provider);
};

export default getContract;
