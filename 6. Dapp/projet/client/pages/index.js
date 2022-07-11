import Header from "../components/header/header";
import { CircularProgress, Container } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import GlobalContext from "../utils/global-context";
import contractInstance from "../utils/get-contract";
import Owner from "./owner";

export default function Home() {
  const [contract, setContract] = useState();
  const [contractWithSigner, setContractWithSigner] = useState();
  const { provider, walletConnected, isOwner } = useContext(GlobalContext);

  async function init() {
    if (provider && walletConnected) {
      const _contract = await contractInstance(provider);
      setContract(_contract);
      const signer = provider.getSigner();
      setContractWithSigner(_contract.connect(signer));
    }
  }

  useEffect(() => {
    init();
  }, [provider, walletConnected]);

  return (
    <div>
      <Header></Header>
      <Container centerContent>
        {walletConnected && contract && contractWithSigner && isOwner && (
          <Owner
            contract={contract}
            contractWithSigner={contractWithSigner}
          ></Owner>
        )}
        {!walletConnected && <CircularProgress isIndeterminate />}
      </Container>
    </div>
  );
}
