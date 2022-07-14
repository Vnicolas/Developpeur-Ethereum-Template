import "../styles/globals.scss";
import {
  Badge,
  Box,
  ChakraProvider,
  createStandaloneToast,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import GlobalContext from "../utils/global-context";
import CustomModal from "../components/modal/modal";

const { ToastContainer } = createStandaloneToast();

function MyApp({ Component, pageProps }) {
  const [state, setState] = useState({
    walletConnected: false,
    userAccount: undefined,
    provider: undefined,
    isOwner: false,
    modalOptions: {},
    modalOpened: false,
    txLoading: false,
    update,
  });

  function update(data) {
    setState(Object.assign({}, state, data));
  }

  const handleClose = () => {
    update({ ...state, modalOpened: false });
  };

  return (
    <>
      <GlobalContext.Provider value={state}>
        <ChakraProvider>
          {state.modalOpened && (
            <CustomModal
              isOpen={state.modalOpened}
              title={state.modalOptions.title}
              handleClose={handleClose}
            >
              {state.modalOptions.type === "voter" && (
                <Stack direction="column" spacing={4}>
                  <Box>
                    Address :{" "}
                    <Text as="samp">{state.modalOptions.data.address}</Text>
                  </Box>
                  <Box>
                    Registered :{" "}
                    <Badge
                      colorScheme={
                        state.modalOptions.data.isRegistered ? "green" : "red"
                      }
                    >
                      {state.modalOptions.data.isRegistered ? "true" : "false"}
                    </Badge>
                  </Box>
                  <Box>
                    Has voted :{" "}
                    <Badge
                      colorScheme={
                        state.modalOptions.data.hasVoted ? "green" : "red"
                      }
                    >
                      {state.modalOptions.data.hasVoted ? "true" : "false"}
                    </Badge>
                  </Box>
                  {state.modalOptions.data.hasVoted && (
                    <Box>
                      Voted Proposal ID :{" "}
                      <Tag
                        borderRadius="full"
                        variant="solid"
                        size="md"
                        colorScheme="blue"
                      >
                        {parseInt(state.modalOptions.data.votedProposalId._hex)}
                      </Tag>
                    </Box>
                  )}
                </Stack>
              )}
              {state.modalOptions.type === "proposal" && (
                <Stack direction="column" spacing={4}>
                  <Box>Description : {state.modalOptions.data.description}</Box>
                  <Box>
                    Vote count :{" "}
                    <Text as="samp">
                      {parseInt(state.modalOptions.data.voteCount._hex)}
                    </Text>
                  </Box>
                </Stack>
              )}
            </CustomModal>
          )}

          <Component {...pageProps} />
        </ChakraProvider>
      </GlobalContext.Provider>
      <ToastContainer />
    </>
  );
}

export default MyApp;
