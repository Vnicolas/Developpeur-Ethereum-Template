import { ethers } from "ethers";
import Contract from "../../build/contracts/Voting.json";

// Todo: Utiliser l'addr déployé sur Ropsten après corrections de sécurité
const contractAddress = "0xc12eae2b2702bb9e6777c48f5e9FcDE96593830C";

const getContract = async (provider) => {
  return new ethers.Contract(contractAddress, Contract.abi, provider);
};

export default getContract;
