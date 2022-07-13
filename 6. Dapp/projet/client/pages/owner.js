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

export default function Owner(props) {
  const { contract, contractWithSigner, currentStatus } = props;

  return (
    <>
      <Box padding="6">
        <Heading textAlign={"center"}>Actions</Heading>
      </Box>
      <Stack direction="column" spacing={8}>
        <InputGroup>
          <InputLeftAddon children="Add voter" />
          <Input
            type="text"
            placeholder="0x..."
            disabled={currentStatus === 0 ? false : true}
          />
          <Box paddingLeft="2">
            <Button variant="solid" colorScheme="teal">
              Submit
            </Button>
          </Box>
        </InputGroup>
        <Divider />
        <Button
          colorScheme="teal"
          variant="solid"
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
