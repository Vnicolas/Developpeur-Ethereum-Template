import Header from "../components/header/header";
import { Box, Center, CircularProgress, SimpleGrid } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import GlobalContext from "../utils/global-context";
import contractInstance from "../utils/get-contract";
import Owner from "./owner";
import Status from "../components/status/status";
import Voter from "./voter";
import { handleSuccess, handleInfos } from "../utils/common";

export default function Home() {
  const [contract, setContract] = useState();
  const [contractWithSigner, setContractWithSigner] = useState();
  const [currentStatus, setCurrentStatus] = useState();
  const { provider, walletConnected, isOwner, txLoading } =
    useContext(GlobalContext);

  const subscribeToStatus = (contract) => {
    contract.off("WorkflowStatusChange");
    contract.on("WorkflowStatusChange", (previousStatus, newStatus) => {
      console.log(`Status changed from ${previousStatus} to ${newStatus}`);
      setCurrentStatus(currentStatus);
    });
  };

  const subscribeToVoterAdded = async (contract, provider) => {
    const startBlockNumber = await provider.getBlockNumber();
    contract.off("VoterRegistered");
    contract.on("VoterRegistered", (...args) => {
      const event = args[args.length - 1];
      if (event.blockNumber <= startBlockNumber) return; // do not react to this event
      const voterAddr = args[0];
      if (isOwner) {
        handleSuccess(`New voter added : ${voterAddr}`);
      } else {
        handleInfos(`New voter added : ${voterAddr}`);
      }
    });
  };

  const getStatus = async (contract) => {
    const currentStatus = await contract.workflowStatus();
    setCurrentStatus(currentStatus);
    subscribeToStatus(contract);
  };

  const init = async () => {
    if (provider && walletConnected) {
      const _contract = await contractInstance(provider);
      setContract(_contract);
      const signer = provider.getSigner();
      setContractWithSigner(_contract.connect(signer));
      getStatus(_contract);
      subscribeToVoterAdded(_contract, provider);
    }
  };

  useEffect(() => {
    init();
  }, [provider, walletConnected]);

  return (
    <>
      <Header></Header>
      <Center>
        <>
          {contract && walletConnected && contract && contractWithSigner && (
            <SimpleGrid columns={2} spacing="40px">
              <Box>
                <Status currentStatus={currentStatus}></Status>
              </Box>
              <Box w="400px">
                {isOwner && (
                  <Owner
                    contract={contract}
                    contractWithSigner={contractWithSigner}
                    currentStatus={currentStatus}
                  ></Owner>
                )}
                {!isOwner && (
                  <Voter
                    provider={provider}
                    contract={contract}
                    contractWithSigner={contractWithSigner}
                    currentStatus={currentStatus}
                  ></Voter>
                )}
              </Box>
            </SimpleGrid>
          )}
          {txLoading && (
            <>
              <div className="overlay"></div>
              <div className="generic-loader">
                <CircularProgress isIndeterminate />
              </div>
            </>
          )}
        </>
        {!walletConnected && (
          <Center padding="16">
            <CircularProgress isIndeterminate />
          </Center>
        )}
      </Center>
    </>
  );
}
