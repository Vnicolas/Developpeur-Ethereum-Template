const Voting = artifacts.require("./Voting.sol");

const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

contract("Voting", async (accounts) => {
  const owner = accounts[0];
  const fromOwner = { from: owner };
  const voter1 = accounts[1];
  const voter2 = accounts[2];
  const voter3 = accounts[3];

  let votingInstance;

  before(async () => {
    votingInstance = await Voting.deployed();
  });

  it("First account should be the owner", async () => {
    const contractOwner = await votingInstance.owner.call();
    expect(contractOwner).to.equal(owner);
  });

  context("Voters Registration step", () => {
    after(async () => {
      await votingInstance.addVoter(voter3, fromOwner);
    });

    it("should revert if caller is not owner", async () => {
      await expectRevert(
        votingInstance.addVoter(voter1, { from: voter1 }),
        "Ownable: caller is not the owner"
      );
    });

    it("should register the voter", async () => {
      await votingInstance.addVoter(voter1, fromOwner);
      const voter = await votingInstance.getVoter(voter1, { from: voter1 });
      expect(voter.isRegistered).to.be.true;
    });

    it("should revert if submit the same address", async () => {
      await expectRevert(
        votingInstance.addVoter(voter1, fromOwner),
        "Already registered"
      );
    });

    it("should emit the 'VoterRegistered' event", async () => {
      expectEvent(
        await votingInstance.addVoter(voter2, fromOwner),
        "VoterRegistered",
        { voterAddress: voter2 }
      );
    });
  });

  context("Changing to 'Proposals Registration Started' step", () => {
    it("should revert if caller is not owner", async () => {
      await expectRevert(
        votingInstance.startProposalsRegistering({ from: voter1 }),
        "Ownable: caller is not the owner"
      );
    });

    it("should increment the workflow and emit event", async () => {
      const workflowStatusBefore = await votingInstance.workflowStatus.call();
      expectEvent(
        await votingInstance.startProposalsRegistering(),
        "WorkflowStatusChange",
        { previousStatus: new BN(0), newStatus: new BN(1) }
      );
      const workflowStatusAfter = await votingInstance.workflowStatus.call();
      expect(new BN(workflowStatusAfter)).to.be.a.bignumber.equal(
        new BN(workflowStatusBefore).add(new BN(1))
      );
    });

    it("should revert if not in the previous step before", async () => {
      await expectRevert(
        votingInstance.startProposalsRegistering(),
        "Registering proposals cant be started now"
      );
    });
  });

  context("Proposals Registration step", () => {
    it("should not allow to add a voter", async () => {
      await expectRevert(
        votingInstance.addVoter(voter1, fromOwner),
        "Voters registration is not open yet"
      );
    });

    it("should revert if caller is not a voter", async () => {
      await expectRevert(
        votingInstance.addProposal("proposal 1", fromOwner),
        "You're not a voter"
      );
    });

    it("should revert if empty proposal", async () => {
      await expectRevert(
        votingInstance.addProposal("", { from: voter1 }),
        "Vous ne pouvez pas ne rien proposer"
      );
    });

    it("should add the proposal", async () => {
      await votingInstance.addProposal("proposal 1", { from: voter1 });
      const proposal = await votingInstance.getOneProposal(new BN(0), {
        from: voter1,
      });
      expect(proposal.description).to.equal("proposal 1");
    });

    it("should emit the 'ProposalRegistered' event", async () => {
      expectEvent(
        await votingInstance.addProposal("proposal 2", { from: voter1 }),
        "ProposalRegistered",
        { proposalId: new BN(1) }
      );
    });
  });

  context("Changing to 'Proposals Registration Ended' step", () => {
    it("should revert if caller is not owner", async () => {
      await expectRevert(
        votingInstance.endProposalsRegistering({ from: voter1 }),
        "Ownable: caller is not the owner"
      );
    });

    it("should increment the workflow and emit event", async () => {
      const workflowStatusBefore = await votingInstance.workflowStatus.call();
      expectEvent(
        await votingInstance.endProposalsRegistering(),
        "WorkflowStatusChange",
        { previousStatus: new BN(1), newStatus: new BN(2) }
      );
      const workflowStatusAfter = await votingInstance.workflowStatus.call();
      expect(new BN(workflowStatusAfter)).to.be.a.bignumber.equal(
        new BN(workflowStatusBefore).add(new BN(1))
      );
    });

    it("should revert if not in the previous step before", async () => {
      await expectRevert(
        votingInstance.endProposalsRegistering(),
        "Registering proposals havent started yet"
      );
    });
  });

  context("Changing to 'Start Voting Session' step", () => {
    it("should revert if caller is not owner", async () => {
      await expectRevert(
        votingInstance.startVotingSession({ from: voter1 }),
        "Ownable: caller is not the owner"
      );
    });

    it("should increment the workflow and emit event", async () => {
      const workflowStatusBefore = await votingInstance.workflowStatus.call();
      expectEvent(
        await votingInstance.startVotingSession(),
        "WorkflowStatusChange",
        { previousStatus: new BN(2), newStatus: new BN(3) }
      );
      const workflowStatusAfter = await votingInstance.workflowStatus.call();
      expect(new BN(workflowStatusAfter)).to.be.a.bignumber.equal(
        new BN(workflowStatusBefore).add(new BN(1))
      );
    });

    it("should revert if not in the previous step before", async () => {
      await expectRevert(
        votingInstance.startVotingSession(),
        "Registering proposals phase is not finished"
      );
    });
  });

  context("Voting step", () => {
    it("should not allow to add a proposal", async () => {
      await expectRevert(
        votingInstance.addProposal("proposal 1", { from: voter1 }),
        "Proposals are not allowed yet"
      );
    });

    it("should revert if caller is not a voter", async () => {
      await expectRevert(
        votingInstance.setVote(new BN(0), fromOwner),
        "You're not a voter"
      );
    });

    it("should not allow to tally votes", async () => {
      await expectRevert(
        votingInstance.tallyVotes(fromOwner),
        "Current status is not voting session ended"
      );
    });

    it("should revert if proposal not found", async () => {
      await expectRevert(
        votingInstance.setVote(new BN(99), { from: voter1 }),
        "Proposal not found"
      );
    });

    it("should set a vote for the voter", async () => {
      await votingInstance.setVote(new BN(0), { from: voter1 });
      const voter = await votingInstance.getVoter(voter1, { from: voter1 });
      expect(voter.votedProposalId).to.be.a.bignumber.equal(new BN(0));
      expect(voter.hasVoted).to.be.true;
    });

    it("should increment the proposal's vote count", async () => {
      const proposalBeforeVote = await votingInstance.getOneProposal(
        new BN(1),
        { from: voter2 }
      );
      await votingInstance.setVote(new BN(1), { from: voter2 });
      const proposalAfterVote = await votingInstance.getOneProposal(new BN(1), {
        from: voter2,
      });
      expect(new BN(proposalAfterVote)).to.be.a.bignumber.equal(
        new BN(proposalBeforeVote) + new BN(1)
      );
    });

    it("should revert if voter has already voted", async () => {
      await expectRevert(
        votingInstance.setVote(new BN(0), { from: voter1 }),
        "You have already voted"
      );
    });

    it("should emit the 'Voted' event", async () => {
      expectEvent(
        await votingInstance.setVote(new BN(1), { from: voter3 }),
        "Voted",
        { voter: voter3, proposalId: new BN(1) }
      );
    });
  });

  context("Changing to 'End Voting Session' step", () => {
    it("should revert if caller is not owner", async () => {
      await expectRevert(
        votingInstance.endVotingSession({ from: voter1 }),
        "Ownable: caller is not the owner"
      );
    });

    it("should increment the workflow and emit event", async () => {
      const workflowStatusBefore = await votingInstance.workflowStatus.call();
      expectEvent(
        await votingInstance.endVotingSession(),
        "WorkflowStatusChange",
        { previousStatus: new BN(3), newStatus: new BN(4) }
      );
      const workflowStatusAfter = await votingInstance.workflowStatus.call();
      expect(new BN(workflowStatusAfter)).to.be.a.bignumber.equal(
        new BN(workflowStatusBefore).add(new BN(1))
      );
    });

    it("should revert if not in the previous step before", async () => {
      await expectRevert(
        votingInstance.endVotingSession(),
        "Voting session havent started yet"
      );
    });
  });

  context("Tally votes", () => {
    it("should revert if caller is not owner", async () => {
      await expectRevert(
        votingInstance.tallyVotes({ from: voter1 }),
        "Ownable: caller is not the owner"
      );
    });

    it("should set the winning proposal and close the workflow", async () => {
      expectEvent(
        await votingInstance.tallyVotes(fromOwner),
        "WorkflowStatusChange",
        { previousStatus: new BN(4), newStatus: new BN(5) }
      );
      const winningProposalId = await votingInstance.winningProposalID.call();
      expect(new BN(winningProposalId)).to.be.a.bignumber.equal(new BN(1));
      const workflowStatus = await votingInstance.workflowStatus.call();
      expect(new BN(workflowStatus)).to.be.a.bignumber.equal(new BN(5));
    });

    it("should revert if not in the previous step before", async () => {
      await expectRevert(
        votingInstance.tallyVotes(fromOwner),
        "Current status is not voting session ended"
      );
    });
  });

  context("Getters", () => {
    describe("getVoter()", () => {
      it("should revert if caller is not voter", async () => {
        await expectRevert(
          votingInstance.getVoter(voter1, fromOwner),
          "You're not a voter"
        );
      });

      it("should return a Voter struct", async () => {
        const voter = await votingInstance.getVoter(voter1, { from: voter1 });
        expect(typeof voter.isRegistered).to.equal("boolean");
        expect(typeof voter.hasVoted).to.equal("boolean");
        expect(typeof new BN(voter.votedProposalId)).to.be.a.bignumber;
      });
    });

    describe("getOneProposal()", () => {
      it("should revert if caller is not voter", async () => {
        await expectRevert(
          votingInstance.getOneProposal(new BN(0), fromOwner),
          "You're not a voter"
        );
      });

      it("should revert if parameter is not correct", async () => {
        await expectRevert.unspecified(
          votingInstance.getOneProposal(new BN(99), {
            from: voter1,
          })
        );
      });

      it("should return a Proposal struct", async () => {
        const proposal = await votingInstance.getOneProposal(new BN(0), {
          from: voter1,
        });
        expect(typeof proposal.description).to.equal("string");
        expect(typeof new BN(proposal.voteCount)).to.be.a.bignumber;
      });
    });
  });
});
