import {
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  Divider,
  Heading,
  Box,
} from "@chakra-ui/react";
import { createRef, useContext } from "react";
import GetProposal from "../components/proposals/get-proposal";
import GetVoter from "../components/get-voter/get-voter";
import { handleError } from "../utils/common";
import GlobalContext from "../utils/global-context";
import AddProposal from "../components/proposals/add-proposal";
import VoteProposal from "../components/proposals/vote-proposal";

export default function Owner(props) {
  const { contractWithSigner, currentStatus } = props;
  const global = useContext(GlobalContext);

  let voterInputValue = createRef();

  const sendTx = async (functionName, txData) => {
    try {
      global.update({ ...global, txLoading: true });
      let tx;
      if (txData) {
        tx = await contractWithSigner[functionName](txData);
      } else {
        tx = await contractWithSigner[functionName]();
      }
      await tx.wait();
      global.update({ ...global, txLoading: false });
    } catch (error) {
      global.update({ ...global, txLoading: false });
      handleError(error);
    }
  };

  const addVoter = () => {
    sendTx("addVoter", voterInputValue.current.value);
  };

  const startProposalsRegistration = async () => {
    sendTx("startProposalsRegistering");
  };

  const endProposalsRegistering = async () => {
    sendTx("endProposalsRegistering");
  };

  const startVotingSession = async () => {
    sendTx("startVotingSession");
  };

  const endVotingSession = async () => {
    sendTx("endVotingSession");
  };

  const tallyVotes = async () => {
    sendTx("tallyVotes");
  };

  return (
    <>
      <Box padding="6">
        <Heading textAlign={"center"}>Actions</Heading>
      </Box>
      <Divider borderColor="gray.200" mb="6" />
      <Stack direction="column" spacing={8} mb="8">
        <GetVoter contractWithSigner={contractWithSigner}></GetVoter>
        <GetProposal contractWithSigner={contractWithSigner}></GetProposal>
        <Divider />
        <InputGroup>
          <InputLeftAddon>Add voter</InputLeftAddon>
          <Input
            type="text"
            placeholder="0x..."
            ref={voterInputValue}
            disabled={currentStatus === 0 ? false : true}
          />
          <Box paddingLeft="2">
            <Button
              variant="solid"
              colorScheme="teal"
              onClick={addVoter}
              disabled={currentStatus === 0 ? false : true}
            >
              Submit
            </Button>
          </Box>
        </InputGroup>
        <AddProposal
          contractWithSigner={contractWithSigner}
          currentStatus={currentStatus}
        ></AddProposal>
        <VoteProposal
          contractWithSigner={contractWithSigner}
          currentStatus={currentStatus}
        ></VoteProposal>
        <Button
          colorScheme="teal"
          variant="solid"
          onClick={startProposalsRegistration}
          disabled={currentStatus === 0 ? false : true}
        >
          Start Proposals registration
        </Button>
        <Button
          colorScheme="teal"
          variant="solid"
          onClick={endProposalsRegistering}
          disabled={currentStatus === 1 ? false : true}
        >
          End Proposals registration
        </Button>
        <Button
          colorScheme="teal"
          variant="solid"
          onClick={startVotingSession}
          disabled={currentStatus === 2 ? false : true}
        >
          Start Voting session
        </Button>
        <Button
          colorScheme="teal"
          variant="solid"
          onClick={endVotingSession}
          disabled={currentStatus === 3 ? false : true}
        >
          End Voting session
        </Button>
        <Button
          colorScheme="teal"
          variant="solid"
          onClick={tallyVotes}
          disabled={currentStatus === 4 ? false : true}
        >
          Tally votes
        </Button>
      </Stack>
    </>
  );
}
