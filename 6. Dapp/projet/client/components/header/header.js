import styles from "./header.module.scss";
import { useContext, useEffect } from "react";
import GlobalContext from "../../utils/global-context";
import contractInstance from "../../utils/get-contract";
import { ethers } from "ethers";
import {
  Box,
  Flex,
  Spacer,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";

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
    provider.provider.on("chainChanged", connectWallet);
    const { chainId } = await provider.getNetwork();

    if (chainId === 3) {
      console.log("Ropsten Network");
    }
    if (chainId === 1337) {
      console.log("Local RPC Network");
    }
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
    try {
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
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.header}>
      <Flex minWidth="max-content" alignItems="center" gap="2" bg="grey.200">
        <Box p="2">
          <Text fontSize="2xl">Voting system</Text>
        </Box>
        <Spacer />
        {global.isOwner ? (
          <Tag size="lg" variant="solid" colorScheme="orange" borderRadius="6">
            <TagLeftIcon boxSize="12px" as={ViewIcon} />
            <TagLabel>Owner</TagLabel>
          </Tag>
        ) : (
          <Tag
            size="lg"
            variant="solid"
            color="white"
            colorScheme="blue"
            borderRadius="6"
          >
            <TagLeftIcon boxSize="12px" as={ViewIcon} />
            <TagLabel>Public</TagLabel>
          </Tag>
        )}

        <Box p="4" borderRadius="lg">
          {!global.walletConnected && (
            <span>Not connected, please be on Ropsten Network</span>
          )}
          {global.walletConnected && (
            <Tag
              size="lg"
              variant="solid"
              color="white"
              colorScheme="teal"
              borderRadius="6"
            >
              <TagLabel>
                <Text as="samp">{global.userAccount}</Text>
              </TagLabel>
            </Tag>
          )}
        </Box>
      </Flex>
    </div>
  );
};

export default Header;
