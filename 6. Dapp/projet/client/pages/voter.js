import { Stack, Divider, Heading, Box } from "@chakra-ui/react";
import GetProposal from "../components/proposals/get-proposal";
import GetVoter from "../components/get-voter/get-voter";
import VoteProposal from "../components/proposals/vote-proposal";
import AddProposal from "../components/proposals/add-proposal";

export default function Voter(props) {
  const { contractWithSigner, currentStatus } = props;

  return (
    <>
      <Box padding="6">
        <Heading textAlign="center">Actions</Heading>
      </Box>
      <Stack direction="column" spacing={8} mb="4">
        <GetVoter contractWithSigner={contractWithSigner}></GetVoter>
        <GetProposal contractWithSigner={contractWithSigner}></GetProposal>
        <Divider />
        <AddProposal
          contractWithSigner={contractWithSigner}
          currentStatus={currentStatus}
        ></AddProposal>
        <VoteProposal
          contractWithSigner={contractWithSigner}
          currentStatus={currentStatus}
        ></VoteProposal>
      </Stack>
    </>
  );
}
