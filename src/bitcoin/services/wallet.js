import '../../../shim';
const {
  createHDWallet,
  generateHDWallet,
  checkBalance,
  fetchTransactions,
  getP2SH,
  generateMultiSig,
  createTransaction,
  signTransaction,
  broadcastTransaction,
} = require('../utilities/bitcoin');



const createWallet = passphrase => createHDWallet(passphrase);
const importWallet = (mnemonic, passphrase) => generateHDWallet(mnemonic, passphrase);

const getBalance = async (address) => {
  const balance = await checkBalance(address);
  return balance;
};

const getTransactions = async (address) => {
  const transactionsArray = await fetchTransactions(address);
  return transactionsArray;
};

const createMultiSig = (required, ...pubKeys) => {
  if (required <= 0 || required > pubKeys.length) {
    throw new Error('Inappropriate value for required param');
  }
  return generateMultiSig({ required, pubKeys });
};

const transfer = async ({
  senderAddress, recipientAddress, amount, keyPair,
}) => {
  const balance = await checkBalance(senderAddress);
  if (balance <= amount) { // logic for fee inclusion can also be accomodated
    throw new Error('Insufficient balance');
  }

  const txnObj = await createTransaction({ senderAddress, recipientAddress, amount });
  console.log('---- Transaction Created ----');

  const p2sh = getP2SH(keyPair);
  const txnHash = signTransaction({
    inputs: txnObj.inputs,
    txb: txnObj.txb,
    keyPairs: [keyPair],
    redeemScript: p2sh.redeem.output,
  });
  console.log('---- Transaction Signed ----');

  const res = await broadcastTransaction(txnHash);
  console.log('---- Transaction Broadcasted ----');

  return res;
};

module.exports = {  
  createWallet,
  importWallet,
  getBalance,
  getTransactions,
  createMultiSig,
  transfer,
};  

// //// SMOKE TEST ZONE //////

// createWallet();

// createWallet().then(res => {
//   console.log('Reimporting the wallet');
//   importWallet(res.mnemonic);
// });

// getBalance('1EVzaFkkNNXq6RJh2oywwJMn8JPiq8ikDi').then(console.log);
// getTransactions('1EVzaFkkNNXq6RJh2oywwJMn8JPiq8ikDi').then(console.log);

// console.log(
//   createMultiSig(
//     2,
//     '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
//     '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9'
//   )
// );

const testCycle = async () => {
  // 1. Import an HD Wallet (With a pre-funded address)
  const mnemonic = 'spray danger ostrich volume soldier scare shed excess jeans scheme hammer exist';
  const { keyPair, address } = importWallet(mnemonic);

  // 2. Fund the account (for testing transfer fxn) // Already funded

  // 3. Transfer
  const { success, txid } = await transfer({
    senderAddress: address,
    recipientAddress: '2NFb3TpSctXBdax6pJaPaAuJG9tKzuihCrz',
    amount: 3e4,
    keyPair,
  });

  if (success) {
    console.log("Transaction successful, here's the transaction ID:", txid);
  } else {
    throw new Error('Transaction failed, something went wrong!');
  }
};

 //testCycle();    
