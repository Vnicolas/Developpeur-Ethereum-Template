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

export default function GetProposal(props) {
  const { contractWithSigner } = props;
  const global = useContext(GlobalContext);

  let proposalInputValue = createRef();

  const getProposal = async () => {
    try {
      const proposal = await contractWithSigner.getOneProposal(
        proposalInputValue.current.value
      );
      const modalOptions = {
        type: "proposal",
        title: "Proposal Infos",
        data: proposal,
      };
      global.update({ ...global, modalOptions, modalOpened: true });
    } catch (error) {
      handleError(error);
    }
  };

  return (
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
  );
}
