import "../styles/globals.scss";
import { ChakraProvider, createStandaloneToast } from "@chakra-ui/react";
import { useState } from "react";
import GlobalContext from "../utils/global-context";

const { ToastContainer } = createStandaloneToast();

function MyApp({ Component, pageProps }) {
  const [state, setState] = useState({
    walletConnected: false,
    userAccount: undefined,
    provider: undefined,
    isOwner: false,
    txLoading: false,
    update,
  });

  function update(data) {
    setState(Object.assign({}, state, data));
  }

  return (
    <>
      <GlobalContext.Provider value={state}>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </GlobalContext.Provider>
      <ToastContainer />
    </>
  );
}

export default MyApp;
