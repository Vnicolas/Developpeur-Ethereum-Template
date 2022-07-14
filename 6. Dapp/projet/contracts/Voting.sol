// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Voting
 * @author Nicolas Vairaa
 * @notice Implements voting process for a small organization with one Admin (launcher of the contract).
 */
contract Voting is Ownable {
    struct Voter {
        bool isRegistered; // If true, that person is registered
        bool hasVoted; // if true, that person has voted
        uint256 votedProposalId; // Index of the voted proposal for this voter
    }

    struct Proposal {
        string description; // Short text
        uint256 voteCount; // Number of accumulated votes
    }

    enum WorkflowStatus {
        RegisteringVoters, // Admin can register voter with their address
        ProposalsRegistrationStarted, // Voters can register their proposals
        ProposalsRegistrationEnded, // Voters are no longer able to register their proposals
        VotingSessionStarted, // Voters can vote for their favorite proposal (1 vote / voter)
        VotingSessionEnded, // Voters are no longer able to vote, and votes are being tallied
        VotesTallied // All votes are tallied, results should be visible
    }

    uint256 public winningProposalId;
    WorkflowStatus public workflowStatus;
    Proposal[] proposals;
    mapping(address => Voter) voters;

    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );
    event ProposalRegistered(uint256 proposalId);
    event Voted(address voter, uint256 proposalId);

    /**
     * @notice Returns if the address is a voter
     */
    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }

    // ::::::::::::: GETTERS ::::::::::::: //
    /**
     * @dev Returns a voter by its address
     * @param _addr The voter's address
     */
    function getVoter(address _addr)
        external
        view
        onlyVoters
        returns (Voter memory)
    {
        return voters[_addr];
    }

    /**
     * @notice Get a proposals by its id
     * @param _id The proposal's id
     */
    function getOneProposal(uint256 _id)
        external
        view
        onlyVoters
        returns (Proposal memory)
    {
        return proposals[_id];
    }

    // ::::::::::::: REGISTRATION ::::::::::::: //
    /**
     * @notice Add a voter with its address
     * @param _addr The address to register
     * @dev Emit the VoterRegistered event
     */
    function addVoter(address _addr) external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.RegisteringVoters,
            "Voters registration is not open yet"
        );
        require(voters[_addr].isRegistered != true, "Already registered");

        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }

    // ::::::::::::: PROPOSAL ::::::::::::: //
    /**
     * @notice Add a proposal with its description
     * @param _desc The proposal's description
     * @dev Emit the ProposalRegistered event
     */
    function addProposal(string calldata _desc) external onlyVoters {
        require(proposals.length < 500, "Too much proposals registered.");
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationStarted,
            "Proposals are not allowed yet"
        );
        require(
            keccak256(abi.encode(_desc)) != keccak256(abi.encode("")),
            "Vous ne pouvez pas ne rien proposer"
        );

        proposals.push(Proposal(_desc, 0));
        emit ProposalRegistered(proposals.length - 1);
    }

    // ::::::::::::: VOTE ::::::::::::: //
    /**
     * @notice Increment by 1 the vote count for a proposal
     * @param _id The proposal's id
     * @dev Emit the Voted event
     */
    function setVote(uint256 _id) external onlyVoters {
        require(
            workflowStatus == WorkflowStatus.VotingSessionStarted,
            "Voting session havent started yet"
        );
        require(voters[msg.sender].hasVoted != true, "You have already voted");
        require(_id < proposals.length, "Proposal not found");

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposals[_id].voteCount++;

        emit Voted(msg.sender, _id);
    }

    // ::::::::::::: STATE ::::::::::::: //
    /**
     * @notice Set the workflow in order to allow voters to register proposals
     * @dev Emit the WorkflowStatusChange event
     */
    function startProposalsRegistering() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.RegisteringVoters,
            "Registering proposals cant be started now"
        );
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(
            WorkflowStatus.RegisteringVoters,
            WorkflowStatus.ProposalsRegistrationStarted
        );
    }

    /**
     * @notice Set the workflow in order to not allow voters to register proposals anymore
     * @dev Emit the WorkflowStatusChange event
     */
    function endProposalsRegistering() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationStarted,
            "Registering proposals havent started yet"
        );
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationStarted,
            WorkflowStatus.ProposalsRegistrationEnded
        );
    }

    /**
     * @notice Set the workflow in order to allow voters to vote for a proposal
     * @dev Emit the WorkflowStatusChange event
     */
    function startVotingSession() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationEnded,
            "Registering proposals phase is not finished"
        );
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationEnded,
            WorkflowStatus.VotingSessionStarted
        );
    }

    /**
     * @notice Set the workflow in order to not allow voters to vote for a proposal anymore
     * @dev Emit the WorkflowStatusChange event
     */
    function endVotingSession() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.VotingSessionStarted,
            "Voting session havent started yet"
        );
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionStarted,
            WorkflowStatus.VotingSessionEnded
        );
    }

    /**
     * @notice Tally all votes, set the winning proposal
     * @dev Emit the WorkflowStatusChange event
     */
    function tallyVotes() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.VotingSessionEnded,
            "Current status is not voting session ended"
        );
        uint256 _winningProposalId;
        Proposal[] memory _proposals = proposals;
        uint256 _proposalsLength = _proposals.length; //  caching length instead of re-compute for each loop
        for (
            uint256 proposalIndex = 0;
            proposalIndex < _proposalsLength;
            proposalIndex++
        ) {
            if (
                _proposals[proposalIndex].voteCount >
                _proposals[_winningProposalId].voteCount
            ) {
                _winningProposalId = proposalIndex;
            }
        }
        winningProposalId = _winningProposalId;

        workflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionEnded,
            WorkflowStatus.VotesTallied
        );
    }
}
