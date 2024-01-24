import { Buffer } from 'buffer';
window.global = window;
window.Buffer = Buffer;

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import WalletConnectProvider from '@walletconnect/web3-provider';
import getDAOContract from './DAOContract';
import './App.css';

function App() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(null);
  const [daoContract, setDaoContract] = useState(null);
  const [error, setError] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const contract = await getDAOContract();
        setDaoContract(contract);
        await fetchProposals();
      } catch (error) {
        console.error('Error initializing DAO Contract:', error);
        setError('Failed to initialize DAO Contract.');
      }
    };
    init();
  }, []);

  const fetchProposals = async () => {
    if (!daoContract) return;

    setLoading(true);
    try {
      const proposalCount = await daoContract.methods.proposalCount().call();
      const fetchedProposals = [];
      for (let i = 1; i <= proposalCount; i++) {
        const proposal = await daoContract.methods.proposals(i).call();
        const votePercentage = await daoContract.methods.getVotePercentage(i).call();
        fetchedProposals.push({ id: i, ...proposal, votePercentage });
      }
      setProposals(fetchedProposals);
    } catch (error) {
      console.error('Error fetching proposals:', error);
      setError('Failed to fetch proposals.');
    }
    setLoading(false);
  };

  const connectWallet = async () => {
    if (isConnecting) return;
    setIsConnecting(true);

    try {
      let web3;
      if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } else {
        const walletConnectProvider = new WalletConnectProvider({
          infuraId: "YOUR_INFURA_ID" // Replace with your actual Infura ID
        });
        await walletConnectProvider.enable();
        web3 = new Web3(walletConnectProvider);
      }

      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      const contract = await getDAOContract(web3);
      setDaoContract(contract);
      await fetchProposals();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError(`Wallet connection failed: ${error.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const voteOnProposal = async (proposalId) => {
    if (!daoContract || !account) return;

    setLoading(true);
    try {
      await daoContract.methods.voteOnProposal(proposalId).send({ from: account });
      await fetchProposals(); // Refresh proposals after voting
    } catch (error) {
      console.error('Error voting on proposal:', error);
      setError('Failed to vote on proposal.');
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <h1>DAO Voting System</h1>

      {!account && (
        <button className="connect-wallet-btn" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}

      {loading && <div className="loader">Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="proposals-list">
        <h2>Proposals</h2>
        {proposals.map(proposal => (
          <div className="proposal-item" key={proposal.id}>
            <p>{proposal.description} - Votes: {proposal.voteCount}</p>
            <p>Vote Percentage: {proposal.votePercentage}%</p>
            {account && !proposal.executed && (
              <button className="vote-btn" onClick={() => voteOnProposal(proposal.id)}>
                Vote
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
