import { handleSuccess, handleInfos } from "../utils/common";

const subscribeToVoterAdded = async (contract, provider, isOwner) => {
  const startBlockNumber = await provider.getBlockNumber();
  contract.off("VoterRegistered");
  contract.on("VoterRegistered", (...args) => {
    const event = args[args.length - 1];
    if (event.blockNumber <= startBlockNumber) return; // do not react to this event
    const voterAddr = args[0];
    const toastMessage = `New voter added : ${voterAddr}`;
    if (isOwner) {
      handleSuccess(toastMessage);
    } else {
      handleInfos(toastMessage);
    }
  });
};

const subscribeToProposalRegistered = async (contract, provider, isOwner) => {
  const startBlockNumber = await provider.getBlockNumber();
  contract.off("ProposalRegistered");
  contract.on("ProposalRegistered", (...args) => {
    const event = args[args.length - 1];
    if (event.blockNumber <= startBlockNumber) return; // do not react to this event
    const newProposalId = args[0];
    const toastMessage = `New proposal added with the ID : ${newProposalId}`;
    if (isOwner) {
      handleInfos(toastMessage);
    } else {
      handleSuccess(toastMessage);
    }
  });
};

const subscribeToVoted = async (contract, provider) => {
  const startBlockNumber = await provider.getBlockNumber();
  contract.off("Voted");
  contract.on("Voted", (...args) => {
    const event = args[args.length - 1];
    if (event.blockNumber <= startBlockNumber) return; // do not react to this event
    const toastMessage = `Voter ${args[0]} voted for the proposal with ID ${args[1]}`;
    handleInfos(toastMessage);
  });
};

export {
  subscribeToVoterAdded,
  subscribeToProposalRegistered,
  subscribeToVoted,
};
