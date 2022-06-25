# Voting sytem (Unit tests)

<img src="https://img.shields.io/badge/solc%20version-0.8.14-brightgreen" height="20">

## Installation

Install dependencies

```bash
  npm install
```

Run tests

```bash
  npm run test:dev:js
```

## Run Locally

You must have [Ganache](https://github.com/trufflesuite/ganache) installed and running locally.

## Tests

Tests are grouped by workflow steps, and arranged in the same order :

1. Voters Registration step (`RegisteringVoters`)
2. Proposals Registration Started (`ProposalsRegistrationStarted`)
3. Proposals Registration step (`ProposalsRegistrationEnded`)
4. Proposals Registration Ended (`VotingSessionStarted`)
5. Start Voting Session (`VotingSessionEnded`)
6. End Voting Session (`VotesTallied`)

They are followed by `getters` functions :

-   `getVoter()`
-   `getOneProposal()`

For a total of **38 tests**.

### Additional informations

Modifiers are tested in each function in order to secure all of them.

`.deployed()` is used in order to not re-process the steps before each tests.

---

## Gas reporter

| Method                        |  Min  |  Max  |     Avg | #calls |
| ----------------------------- | :---: | :---: | ------: | :----: |
| `addProposal()`               | 59532 | 76632 |   68082 |   4    |
| `addVoter()`                  |   -   |   -   |   50196 |   4    |
| `endProposalsRegistering()`   |   -   |   -   |   30575 |   2    |
| `endVotingSession()`          |   -   |   -   |   30509 |   2    |
| `setVote()`                   | 58101 | 78013 |   65676 |   6    |
| `startProposalsRegistering()` |   -   |   -   |   47653 |   2    |
| `startVotingSession()`        |   -   |   -   |   30530 |   2    |
| `tallyVotes()`                |   -   |   -   |   60637 |   2    |
| **Totals Avg**                |       |       | 2137238 |        |
