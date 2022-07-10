import styles from "./header.module.scss";
import { useContext, useEffect } from "react";
import GlobalContext from "../../utils/global-context";
import contractInstance from "../../utils/get-contract";
import { ethers } from "ethers";
import { Box, Flex, Spacer } from "@chakra-ui/react";

const Header = () => {
  const global = useContext(GlobalContext);

  useEffect(() => {
    connectWallet();
  }, []);

  async function getProvider() {
    const { ethereum } = window;
    let provider;

    if (ethereum) {
      provider = new ethers.providers.Web3Provider(ethereum);
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      ); // message d’erreur si le navigateur ne détecte pas Ethereum
    }

    provider.provider.on("accountsChanged", connectWallet);
    return provider;
  }

  async function getAccount(provider) {
    const accounts = await provider.listAccounts();
    if (accounts.length === 0) {
      await provider.send("eth_requestAccounts", []);
    }
    const accountsInWallet = await provider.listAccounts();
    return accountsInWallet[0];
  }

  async function connectWallet() {
    const provider = await getProvider();
    if (!provider) {
      return;
    }
    const userAccount = await getAccount(provider);
    const contract = await contractInstance(provider);
    const owner = await contract.owner();

    global.update({
      walletConnected: true,
      userAccount,
      provider,
      isOwner: userAccount === owner,
    });
  }

  return (
    <div className={styles.header}>
      <Flex>
        <Box p="4" as="h2">
          Voting system ({global.isOwner ? "as Owner" : "as public"})
        </Box>
        <Spacer />
        <Box p="4" bg="green.400" borderRadius="lg" color="#fff">
          {!global.walletConnected && <span>Non connecté</span>}
          {global.walletConnected && <span>{global.userAccount}</span>}
        </Box>
      </Flex>
    </div>
  );
};

export default Header;
