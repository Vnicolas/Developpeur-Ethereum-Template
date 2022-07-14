import {
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  Divider,
  Heading,
  Box,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { createRef } from "react";
import { handleError } from "../utils/common";

export default function Voter(props) {
  const { provider, contract, contractWithSigner, currentStatus } = props;

  let voterInputValue = createRef();
  let proposalInputValue = createRef();

  const getVoter = async () => {
    try {
      const voter = await contract.getVoter(voterInputValue.current.value);
      console.log(voter);
    } catch (error) {
      handleError(error);
    }
  };

  const getProposal = async () => {
    try {
      const proposal = await contract.getOneProposal(
        proposalInputValue.current.value
      );
      console.log(proposal);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <Box padding="6">
        <Heading textAlign="center">Actions</Heading>
      </Box>
      <Stack direction="column" spacing={8}>
        <InputGroup>
          <InputLeftAddon>Find a voter</InputLeftAddon>
          <Input type="text" placeholder="0x..." ref={voterInputValue} />
          <Box paddingLeft="2">
            <Button variant="solid" colorScheme="teal" onClick={getVoter}>
              Submit
            </Button>
          </Box>
        </InputGroup>

        <InputGroup>
          <InputLeftAddon>Find a proposal by its ID</InputLeftAddon>
          <NumberInput defaultValue={0} min={0}>
            <NumberInputField ref={proposalInputValue} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Box paddingLeft="2">
            <Button variant="solid" colorScheme="teal" onClick={getProposal}>
              Submit
            </Button>
          </Box>
        </InputGroup>
        <Divider />
        <InputGroup>
          <InputLeftAddon>Add proposal</InputLeftAddon>
          <Input type="text" disabled={currentStatus === 1 ? false : true} />
          <Box paddingLeft="2">
            <Button
              variant="solid"
              colorScheme="teal"
              disabled={currentStatus === 1 ? false : true}
            >
              Submit
            </Button>
          </Box>
        </InputGroup>
        <InputGroup>
          <InputLeftAddon>Vote for a proposal</InputLeftAddon>
          <NumberInput min={0} disabled={currentStatus === 3 ? false : true}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Box paddingLeft="2">
            <Button
              variant="solid"
              colorScheme="teal"
              disabled={currentStatus === 3 ? false : true}
            >
              Submit
            </Button>
          </Box>
        </InputGroup>
      </Stack>
    </>
  );
}
