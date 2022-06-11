// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

/**
 * @title Voting
 * @author Nicolas Vairaa
 * @dev Implements voting process for a small organization with one Admin (launcher of the contract).
 * - All votes have the same weight
 * - Blank proposal setted
 * - Equality status not managed
 * - Multi sessions not supported
 */
contract Voting is Ownable {

    using Address for address;

    struct Voter {
        bool isRegistered; // If true, that person is registered
        bool hasVoted; // if true, that person has voted
        uint votedProposalId; // Index of the voted proposal for this voter
    }

    struct Proposal {
        string description; // Short text
        uint voteCount; // Number of accumulated votes
    }

    enum WorkflowStatus {
        Before, // Added in order to not start RegisteringVoters next to contract deployment.
        RegisteringVoters, // Admin can register voter with their address
        ProposalsRegistrationStarted, // Voters can register their proposals
        ProposalsRegistrationEnded, // Voters are no longer able to register their proposals
        VotingSessionStarted, // Voters can vote for their favorite proposal (1 vote / voter)
        VotingSessionEnded, // Voters are no longer able to vote, and votes are being tallied
        VotesTallied // All votes are tallied, results should be visible
    }
    
    // The current status of the session
    WorkflowStatus public currentStatus;

    // The blank proposal if voters want vote to 
    Proposal private blankProposal = Proposal("BLANK", 0);

    // Mapping voter address to the voter
    mapping(address => Voter) private whitelist;

    // Array of all proposals
    Proposal[] private proposals;

    // Winning Proposal
    Proposal private winningProposal;

    // Total of voters for the session
    uint private nbVoters;

    // Events
    event VoterRegistered(address voterAddress); 
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted(address voter, uint proposalId);

    /**
     * @dev Returns if the address is in the whitelist
     */
    modifier isWhitelisted() {
        require(whitelist[msg.sender].isRegistered, "This address is not whitelisted.");
        _;
    }

    /**
     * @dev Returns all the proposals
     */
    function getProposals() public view returns(Proposal[] memory) {
        return proposals;
    }

    /**
     * @dev Manage the session status
     * @param _status The status where the session should be
     */
    function setWorkflowStatus(uint8 _status) public onlyOwner {
        require(_status > uint8(currentStatus), "Not possible to go backward or to set the same status.");
        require(_status <= uint8(WorkflowStatus.VotesTallied), "This status does not exists.");
        if (currentStatus == WorkflowStatus.ProposalsRegistrationStarted && proposals.length < 2) {
            revert("Not enough proposals. Total must be greater than one.");
        }
        if (currentStatus == WorkflowStatus.RegisteringVoters && nbVoters < 2) {
            revert("Not enough voters. Total must be greater than one.");
        }

        WorkflowStatus previousStatus = currentStatus;
        currentStatus = WorkflowStatus(_status);
        emit WorkflowStatusChange(previousStatus, currentStatus);
        if (currentStatus == WorkflowStatus.ProposalsRegistrationStarted) {
            // Not set in the constructor in order to save gas fees at the deployment
            proposals.push(blankProposal);
        }
    }

    /**
     * @dev Allows to a voter to be part of the session
     * @param _address The voter's address
     */
    function addToWhitelist(address _address) public onlyOwner {
        require(!_address.isContract(), "Contracts are not allowed.");
        require(!whitelist[_address].isRegistered, "This address is already whitelisted.");
        require(currentStatus == WorkflowStatus.RegisteringVoters, "Voters registrations are not open or are closed.");
        whitelist[_address] = Voter(true, false, 0);
        nbVoters += 1;
        emit VoterRegistered(_address);
    }

    /**
     * @dev Allows to a voter to add a proposal
     * @param _proposalDescription The proposal description
     */
    function makeProposal(string calldata _proposalDescription) isWhitelisted public {
        require(currentStatus == WorkflowStatus.ProposalsRegistrationStarted, "Proposals registrations are not open or are closed.");
        proposals.push(Proposal(_proposalDescription, 0));
        emit ProposalRegistered(proposals.length - 1);
    }

    /**
     * @dev Allows to a voter to vote for a proposal with its id
     * @param _votedProposalId The id of the proposal to vote
     */
    function vote(uint _votedProposalId) isWhitelisted public {
        require(currentStatus == WorkflowStatus.VotingSessionStarted, "Voting session not started or is closed.");
        require(!whitelist[msg.sender].hasVoted, "This address has already voted.");
        proposals[_votedProposalId].voteCount++;
        if (_votedProposalId == 0) { // Don't set uint already setted to 0 (Blank vote)
            whitelist[msg.sender].hasVoted = true;
        } else {
            whitelist[msg.sender].votedProposalId = _votedProposalId;
            whitelist[msg.sender].hasVoted = true;
        }
        emit Voted(msg.sender, _votedProposalId);
    }

    /**
     * @dev Tally all votes and set the winning proposal
     */
    function tallyVotes() public onlyOwner {
        require(currentStatus == WorkflowStatus.VotingSessionEnded, "Voting session not ended.");
        uint counting;
        uint proposalsLength = proposals.length;
        for (uint index=0; index < proposalsLength; index++) {
            if (proposals[index].voteCount > counting) {
                counting = proposals[index].voteCount;
                winningProposal = proposals[index];
            }
        }
        setWorkflowStatus(uint8(WorkflowStatus.VotesTallied));
    }

    /**
     * @dev Returns the winning proposal of the session
     */
    function getWinningProposal() external view returns(Proposal memory) {
        require(currentStatus == WorkflowStatus.VotesTallied, "Votes note tallied yet.");
        return winningProposal;
    }

}
