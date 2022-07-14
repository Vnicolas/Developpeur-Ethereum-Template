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

export default function GetVoter(props) {
  const { contractWithSigner } = props;
  const global = useContext(GlobalContext);

  let voterInputValue = createRef();

  const getVoter = async () => {
    try {
      const voter = await contractWithSigner.getVoter(
        voterInputValue.current.value
      );
      const voterWithAddress = {
        ...voter,
        address: voterInputValue.current.value,
      };
      const modalOptions = {
        type: "voter",
        title: "Voter Infos",
        data: voterWithAddress,
      };
      global.update({ ...global, modalOptions, modalOpened: true });
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <InputGroup>
      <InputLeftAddon>Find a voter</InputLeftAddon>
      <Input type="text" placeholder="0x..." ref={voterInputValue} />
      <Box paddingLeft="2">
        <Button variant="solid" colorScheme="teal" onClick={getVoter}>
          Submit
        </Button>
      </Box>
    </InputGroup>
  );
}
