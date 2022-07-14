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
import { createRef, useContext, useState } from "react";
import { handleError } from "../utils/common";
import GlobalContext from "../utils/global-context";

export default function Owner(props) {
  const { contract, contractWithSigner, currentStatus } = props;
  const global = useContext(GlobalContext);

  let voterInputValue = createRef();

  const addVoter = async () => {
    try {
      global.update({ ...global, txLoading: true });
      const tx = await contractWithSigner.addVoter(
        voterInputValue.current.value
      );
      await tx.wait();
      global.update({ ...global, txLoading: false });
    } catch (error) {
      global.update({ ...global, txLoading: false });
      handleError(error);
    }
  };

  const startProposalsRegistration = async () => {
    try {
      global.update({ ...global, txLoading: true });
      const txVoter = await contractWithSigner.startProposalsRegistering();
      await txVoter.wait();
      global.update({ ...global, txLoading: false });
    } catch (error) {
      global.update({ ...global, txLoading: false });
      handleError(error);
    }
  };

  return (
    <>
      <Box padding="6">
        <Heading textAlign={"center"}>Actions</Heading>
      </Box>
      <Stack direction="column" spacing={8}>
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
        <Divider />
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
          disabled={currentStatus === 1 ? false : true}
        >
          End Proposals registration
        </Button>
        <Button
          colorScheme="teal"
          variant="solid"
          disabled={currentStatus === 2 ? false : true}
        >
          Start Voting session
        </Button>
        <Button
          colorScheme="teal"
          variant="solid"
          disabled={currentStatus === 3 ? false : true}
        >
          End Voting session
        </Button>
        <Button
          colorScheme="teal"
          variant="solid"
          disabled={currentStatus === 4 ? false : true}
        >
          Tally votes
        </Button>
      </Stack>
    </>
  );
}
