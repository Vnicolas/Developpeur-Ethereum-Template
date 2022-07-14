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
  Badge,
} from "@chakra-ui/react";
import { createRef, useContext, useState } from "react";
import CustomModal from "../components/modal/modal";
import { handleError } from "../utils/common";
import GlobalContext from "../utils/global-context";

export default function Voter(props) {
  const { provider, contract, contractWithSigner, currentStatus } = props;
  const global = useContext(GlobalContext);

  const [modalOpened, setModalOpened] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDataType, setModalDataType] = useState(null);
  const [modalData, setModalData] = useState(null);

  let voterInputValue = createRef();
  let proposalInputValue = createRef();
  let proposalDescValue = createRef();

  const getVoter = async () => {
    try {
      const voter = await contractWithSigner.getVoter(
        voterInputValue.current.value
      );
      setModalDataType("voter");
      setModalData(voter);
      setModalTitle("Voter Infos");
      setModalOpened(true);
    } catch (error) {
      handleError(error);
    }
  };

  const getProposal = async () => {
    try {
      const proposal = await contractWithSigner.getOneProposal(
        proposalInputValue.current.value
      );
      setModalDataType("proposal");
      setModalData(proposal);
      setModalTitle("Proposal Infos");
      setModalOpened(true);
    } catch (error) {
      handleError(error);
    }
  };

  const addProposal = async () => {
    try {
      global.update({ ...global, txLoading: true });
      const tx = await contractWithSigner.addProposal(
        proposalDescValue.current.value
      );
      await tx.wait();
      global.update({ ...global, txLoading: false });
    } catch (error) {
      handleError(error);
    }
  };

  const handleClose = (num) => {
    setModalOpened(false);
    setModalTitle("");
  };

  return (
    <>
      {modalOpened && (
        <CustomModal
          isOpen={modalOpened}
          title={modalTitle}
          handleClose={handleClose}
        >
          {modalDataType === "voter" && (
            <Stack direction="column" spacing={4}>
              <Box>
                Registered :{" "}
                <Badge colorScheme={modalData.isRegistered ? "green" : ""}>
                  {modalData.isRegistered ? "true" : "false"}
                </Badge>
              </Box>
              <Box>
                Has voted :{" "}
                <Badge colorScheme={modalData.hasVoted ? "green" : ""}>
                  {modalData.hasVoted ? "true" : "false"}
                </Badge>
              </Box>
              {modalData.hasVoted && (
                <Box>
                  Voted Proposal Id :{" "}
                  <Badge colorScheme="blue">
                    {parseInt(modalData.votedProposalId._hex)}
                  </Badge>
                </Box>
              )}
            </Stack>
          )}
          {modalDataType === "proposal" && (
            <Stack direction="column" spacing={4}>
              <Box>Description : {modalData.description}</Box>
              <Box>Vote count : {parseInt(modalData.voteCount._hex)}</Box>
            </Stack>
          )}
        </CustomModal>
      )}

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
