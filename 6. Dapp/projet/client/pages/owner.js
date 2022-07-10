import { useContext, useEffect } from "react";
import GlobalContext from "../utils/global-context";
import contractInstance from "../utils/get-contract";

export default function Owner(props) {
  const { contract, contractWithSigner } = props;
  const { provider, walletConnected } = useContext(GlobalContext);

  useEffect(() => {
    async function init() {
      const currentStatus = await contract.workflowStatus();
      console.log(currentStatus);
    }
    init();
  }, []);

  // async function init() {
  //   if (provider && walletConnected) {
  //     contract = await contractInstance(provider);
  //     const signer = provider.getSigner();
  //     contractWithSigner = contract.connect(signer);
  //     const currentStatus = await contract.workflowStatus();
  //     console.log(currentStatus);
  //   }
  // };

  return <div>Dapp owner</div>;
}
