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
    contract.on("WorkflowStatusChange", (...args) => {
      const event = args[args.length - 1];
      if (event.blockNumber <= startBlockNumber) return; // do not react to this event
      console.log(`Status changed from ${args[0]} to ${args[1]}`);
      setCurrentStatus(args[1]);
      const toastMessage = `New status setted !`;
      if (isOwner) {
        handleSuccess(toastMessage);
      } else {
        handleInfos(toastMessage);
      }
    });
  };

  const subscribeToVoterAdded = async (contract, provider) => {
    const startBlockNumber = await provider.getBlockNumber();
    contract.off("VoterRegistered");
    contract.on("VoterRegistered", (...args) => {
      const event = args[args.length - 1];
      if (event.blockNumber <= startBlockNumber) return; // do not react to this event
      const voterAddr = args[0];
      const toastMessage = `New voter added : ${voterAddr}`;
      if (isOwner) {
        handleSuccess(toastMessage);
      } else {
        handleInfos(toastMessage);
      }
    });
  };

  const subscribeToProposalRegistered = async (contract, provider) => {
    const startBlockNumber = await provider.getBlockNumber();
    contract.off("ProposalRegistered");
    contract.on("ProposalRegistered", (...args) => {
      const event = args[args.length - 1];
      if (event.blockNumber <= startBlockNumber) return; // do not react to this event
      const newProposalId = args[0];
      const toastMessage = `New proposal added : ${newProposalId}`;
      if (isOwner) {
        handleInfos(toastMessage);
      } else {
        handleSuccess(toastMessage);
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
      subscribeToProposalRegistered(_contract, provider);
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
