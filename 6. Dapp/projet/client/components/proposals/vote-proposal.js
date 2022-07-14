import {
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  Box,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { createRef, useContext } from "react";
import { handleError } from "../../utils/common";
import GlobalContext from "../../utils/global-context";

export default function VoteProposal(props) {
  const { contractWithSigner, currentStatus } = props;
  const global = useContext(GlobalContext);

  let voteValue = createRef();

  const voteForProposal = async () => {
    try {
      global.update({ ...global, txLoading: true });
      const tx = await contractWithSigner.setVote(voteValue.current.value);
      await tx.wait();
      global.update({ ...global, txLoading: false });
    } catch (error) {
      global.update({ ...global, txLoading: false });
      handleError(error);
    }
  };

  return (
    <InputGroup>
      <InputLeftAddon>Vote for a proposal</InputLeftAddon>
      <NumberInput min={0} disabled={currentStatus === 3 ? false : true}>
        <NumberInputField ref={voteValue} />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <Box paddingLeft="2">
        <Button
          variant="solid"
          colorScheme="teal"
          onClick={voteForProposal}
          disabled={currentStatus === 3 ? false : true}
        >
          Submit
        </Button>
      </Box>
    </InputGroup>
  );
}
