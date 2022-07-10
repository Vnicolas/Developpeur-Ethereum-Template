import "../styles/globals.scss";
import { ChakraProvider } from "@chakra-ui/react";
import { useState } from "react";
import GlobalContext from "../utils/global-context";

function MyApp({ Component, pageProps }) {
  const [state, setState] = useState({
    walletConnected: false,
    userAccount: undefined,
    provider: undefined,
    isOwner: false,
    update,
  });

  function update(data) {
    setState(Object.assign({}, state, data));
  }

  return (
    <GlobalContext.Provider value={state}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </GlobalContext.Provider>
  );
}

export default MyApp;
