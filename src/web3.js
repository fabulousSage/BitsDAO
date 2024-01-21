// src/web3.js
import Web3 from 'web3';

let web3;

if (window.ethereum) {
    window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
            web3 = new Web3(window.ethereum);
        })
        .catch(error => {
            console.error("User denied account access or an error occurred:", error);
        });
} else {
    console.log('Non-Ethereum browser detected. Consider using MetaMask!');
}

export default web3;
