import Header from "../components/header/header";
import {
  Box,
  Button,
  Center,
  CircularProgress,
  Divider,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import GlobalContext from "../utils/global-context";
import contractInstance from "../utils/get-contract";
import Owner from "./owner";
import Status from "../components/status/status";
import Voter from "./voter";
import {
  subscribeToVoterAdded,
  subscribeToProposalRegistered,
  subscribeToVoted,
} from "../utils/subscribers";
import { handleError, handleInfos, handleSuccess } from "../utils/common";

export default function Home() {
  const [contract, setContract] = useState();
  const [contractWithSigner, setContractWithSigner] = useState();
  const [currentStatus, setCurrentStatus] = useState();
  const global = useContext(GlobalContext);
  const { provider, walletConnected, isOwner, txLoading } = global;

  let currentContract = useRef();
  currentContract.current = contract;

  const subscribeToStatus = async () => {
    const startBlockNumber = await provider.getBlockNumber();
    currentContract.current.off("WorkflowStatusChange");
    currentContract.current.on("WorkflowStatusChange", (...args) => {
      const event = args[args.length - 1];
      if (event.blockNumber < startBlockNumber) return; // do not react to this event
      setCurrentStatus(args[1]);
      const toastMessage = "New status setted !";
      if (isOwner) {
        handleSuccess(toastMessage);
      } else {
        handleInfos(toastMessage);
      }
    });
  };

  const getStatus = async () => {
    const currentStatus = await currentContract.current.workflowStatus();
    setCurrentStatus(currentStatus);
    subscribeToStatus();
  };

  const getWinningProposal = async () => {
    const winningProposalId = await currentContract.current.winningProposalId();
    try {
      const proposal = await contractWithSigner.getOneProposal(
        winningProposalId
      );
      const modalOptions = {
        type: "proposal",
        title: "Wining Proposal Infos",
        data: proposal,
      };
      global.update({ ...global, modalOptions, modalOpened: true });
    } catch (error) {
      handleError(error);
    }
  };

  const init = async () => {
    if (provider && walletConnected) {
      const _contract = await contractInstance(provider);
      setContract(_contract);
    }
  };

  useEffect(() => {
    init();
  }, [provider, walletConnected]);

  useEffect(() => {
    if (currentContract.current) {
      const signer = provider.getSigner();
      setContractWithSigner(contract.connect(signer));
      getStatus();
      subscribeToVoterAdded(contract, provider, isOwner);
      subscribeToProposalRegistered(contract, provider, isOwner);
      subscribeToVoted(contract, provider);
    }
  }, [contract]);

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
                    contractWithSigner={contractWithSigner}
                    currentStatus={currentStatus}
                  ></Owner>
                )}
                {!isOwner && (
                  <Voter
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
      {currentStatus === 5 && (
        <>
          <Divider></Divider>
          <Center>
            <Box p="8">
              <Button
                colorScheme="teal"
                variant="solid"
                onClick={getWinningProposal}
              >
                Get Winning Proposal
              </Button>
            </Box>
          </Center>
        </>
      )}
    </>
  );
}
