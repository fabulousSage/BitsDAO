// src/DAOContract.js
import getWeb3 from './getWeb3';
import DAOContractABI from './DAOContractABI.json';

const getDAOContract = async () => {
  const web3 = await getWeb3();
  const address = '0x2b048b7f17BeEB8133c31C3ed52CfBA11804A7E9';
  const daoContract = new web3.eth.Contract(DAOContractABI, address);
  return daoContract;
};

export default getDAOContract;
