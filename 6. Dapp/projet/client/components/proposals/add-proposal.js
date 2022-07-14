import {
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  Box,
} from "@chakra-ui/react";
import { createRef, useContext } from "react";
import { handleError } from "../../utils/common";
import GlobalContext from "../../utils/global-context";

export default function AddProposal(props) {
  const { contractWithSigner, currentStatus } = props;
  const global = useContext(GlobalContext);

  let proposalDescValue = createRef();

  const addProposal = async () => {
    try {
      global.update({ ...global, txLoading: true });
      const tx = await contractWithSigner.addProposal(
        proposalDescValue.current.value
      );
      await tx.wait();
      global.update({ ...global, txLoading: false });
    } catch (error) {
      global.update({ ...global, txLoading: false });
      handleError(error);
    }
  };

  return (
    <InputGroup>
      <InputLeftAddon>Add proposal</InputLeftAddon>
      <Input
        type="text"
        ref={proposalDescValue}
        disabled={currentStatus === 1 ? false : true}
      />
      <Box paddingLeft="2">
        <Button
          variant="solid"
          colorScheme="teal"
          disabled={currentStatus === 1 ? false : true}
          onClick={addProposal}
        >
          Submit
        </Button>
      </Box>
    </InputGroup>
  );
}
