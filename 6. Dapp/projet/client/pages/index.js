import Header from "../components/header/header";
import { Box, Center, CircularProgress, SimpleGrid } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import GlobalContext from "../utils/global-context";
import contractInstance from "../utils/get-contract";
import Owner from "./owner";
import Status from "../components/status/status";
import Voter from "./voter";

export default function Home() {
  const [contract, setContract] = useState();
  const [contractWithSigner, setContractWithSigner] = useState();
  const [currentStatus, setCurrentStatus] = useState();
  const { provider, walletConnected, isOwner } = useContext(GlobalContext);

  const getStatus = async (contract) => {
    const currentStatus = await contract.workflowStatus();
    setCurrentStatus(currentStatus);
    console.log(currentStatus);
    contract.on("WorkflowStatusChange", (previousStatus, newStatus) => {
      console.log(`Status changed from ${previousStatus} to ${newStatus}`);
      setCurrentStatus(currentStatus);
    });
  };

  const init = async () => {
    if (provider && walletConnected) {
      const _contract = await contractInstance(provider);
      setContract(_contract);
      const signer = provider.getSigner();
      setContractWithSigner(_contract.connect(signer));
      getStatus(_contract);
    }
  };

  useEffect(() => {
    init();
  }, [provider, walletConnected]);

  return (
    <>
      <Header></Header>
      <Center>
        <>
          {contract && walletConnected && contract && contractWithSigner && (
            <SimpleGrid columns={2} spacing="40px">
              <Box>
                <Status currentStatus={currentStatus}></Status>
              </Box>
              <Box w="400px">
                {isOwner && (
                  <Owner
                    contract={contract}
                    contractWithSigner={contractWithSigner}
                    currentStatus={currentStatus}
                  ></Owner>
                )}
                {!isOwner && (
                  <Voter
                    contract={contract}
                    contractWithSigner={contractWithSigner}
                    currentStatus={currentStatus}
                  ></Voter>
                )}
              </Box>
            </SimpleGrid>
          )}
        </>
        {!walletConnected && (
          <Center padding="16">
            <CircularProgress isIndeterminate />
          </Center>
        )}
      </Center>
    </>
  );
}
