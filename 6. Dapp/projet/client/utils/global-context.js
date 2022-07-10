import React from "react";

const GlobalContext = React.createContext({
  walletConnected: false,
  userAccount: undefined,
  provider: undefined,
  isOwner: false,
});

export default GlobalContext;
