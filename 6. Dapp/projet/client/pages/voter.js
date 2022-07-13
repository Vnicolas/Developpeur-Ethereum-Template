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

export default function Voter(props) {
  const { contract, contractWithSigner, currentStatus } = props;

  return (
    <>
      <Box padding="6">
        <Heading textAlign={"center"}>Actions</Heading>
      </Box>
      <Stack direction="column" spacing={8}>
        <InputGroup>
          <InputLeftAddon>Find a voter</InputLeftAddon>
          <Input type="text" placeholder="0x..." />
          <Box paddingLeft="2">
            <Button variant="solid" colorScheme="teal">
              Submit
            </Button>
          </Box>
        </InputGroup>
        <Divider />
        <InputGroup>
          <InputLeftAddon>Find a proposal by its ID</InputLeftAddon>
          <NumberInput
            defaultValue={0}
            min={0}
            disabled={currentStatus === 0 ? true : false}
          >
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
              disabled={currentStatus === 0 ? true : false}
            >
              Submit
            </Button>
          </Box>
        </InputGroup>
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
