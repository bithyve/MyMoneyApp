const bitcoinJS = require('bitcoinjs-lib');
const bip39 = require('bip39');
const axios = require('axios');
const coinselect = require('coinselect');
const request = require('superagent');

const { TESTNET, MAINNET } = require('../config').API_URLS;
const network = require('../config').NETWORK;   


const getAddress = keyPair => bitcoinJS.payments.p2sh({
  redeem: bitcoinJS.payments.p2wpkh({
    pubkey: keyPair.publicKey,
    network,
  }),
  network,
}).address;

const getP2SH = keyPair => bitcoinJS.payments.p2sh({
  redeem: bitcoinJS.payments.p2wpkh({
    pubkey: keyPair.publicKey,
    network,
  }),
  network,
});


const generateHDWallet = (mnemonic, passphrase) => {
  // generates a HD-Wallet from the provided mnemonic-passphrase pair

  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic');
  }

  const seed = bip39.mnemonicToSeed(mnemonic, passphrase);
  const path = "m/44'/0'/0'/0/0";
  const root = bitcoinJS.bip32.fromSeed(seed, network);
  const child1 = root.derivePath(path);

  const address = getAddress(child1);

  console.log(`Mnemonic: ${mnemonic}`);
  console.log(`Address: ${address}`);

  return {
    mnemonic,
    keyPair: child1,
    address,
  };
};




const createHDWallet = async (passphrase = "Enter passphrase") => {
  // creates a new HD Wallet

  const mnemonic = await bip39.generateMnemonic();
  return generateHDWallet(mnemonic, passphrase);
};

const checkBalance = async (address) => {
  // fetches balance corresponding to the supplied address

  let res;
  if (network === bitcoinJS.networks.testnet) {
    res = await axios.get(`${TESTNET.BALANCE_CHECK}${address}`);
  } else {
    res = await axios.get(`${MAINNET.BALANCE_CHECK}${address}`); // throttled endPoint (required: full node/corresponding paid service));
  }

  const { final_balance, total_received } = res.data[address];
  return {
    final_balance,
    total_received,
  };
};

const fetchTransactions = async (address) => {
  // fetches transactions corresponding to the  supplied address

  const txLimit = 5; // max:50 (use offset and n_tx to recursively capture all txs, if required)
  let res;
  if (network === bitcoinJS.networks.testnet) {
    res = await axios.get(
      `${TESTNET.TX_FETCH.URL}${address}${TESTNET.TX_FETCH.LIMIT}${txLimit}`,
    );
  } else {
    res = await axios.get(
      `${MAINNET.TX_FETCH.URL}${address}${MAINNET.TX_FETCH.LIMIT}${txLimit}`,
    );
  }
  return {
    numberOfTransactions: res.data.n_tx,
    transactions: res.data.txs,
  };
};

// deterministic RNG for testing only (aids in generation of exact address)
function rng1() {
  return Buffer.from('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz1');
}

function rng2() {
  return Buffer.from('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz2');
}

const generateTestnetKeys = (rng) => {
  let keyPair;
  if (rng) {
    keyPair = bitcoinJS.ECPair.makeRandom({
      network,
      rng,
    });
  } else {
    // // for generating random testnet addresses
    keyPair = bitcoinJS.ECPair.makeRandom({
      network,
    });
  }
  const privWIF = keyPair.toWIF();
  const address = getAddress(keyPair);

  console.log(`Generated Address: ${address} \nPrivate Kye[WIF]: ${privWIF} `);

  // return {
  //   privWIF,
  //   address,
  // };

  return keyPair;
};

const fundTestNetAddress = async (address, amount) => request // blockcypher faucet doesn't seems to work (insufficient balance in faucet)
  .post(`${TESTNET.FUND.URL}${TESTNET.FUND.TOKEN}`)
  .send({ address, amount })
  .end((err, res) => {
    if (err) {
      console.log(err);
    }
    console.log(res);
  });

// const generate2of2MultiSigAddress = (pubKey1, pubKey2) => {
//   //2-of-2 multiSig address generator

//   const pubkeys = [pubKey1, pubKey2].map(hex => Buffer.from(hex, 'hex'));
//   const { address } = bitcoinJS.payments.p2sh({
//     redeem: bitcoinJS.payments.p2wsh({
//       redeem: bitcoinJS.payments.p2ms({
//         m: 2,
//         pubkeys
//       })
//     })
//   });
//   return address;
// };

const generateMultiSig = ({ required, pubKeys }) => {
  // generic multiSig address generator

  // if (!network) network = bitcoinJS.networks.bitcoin;
  const pubkeys = pubKeys.map(hex => Buffer.from(hex, 'hex'));

  const p2ms = bitcoinJS.payments.p2ms({ m: required, pubkeys, network });
  const p2wsh = bitcoinJS.payments.p2wsh({ redeem: p2ms, network });
  const p2sh = bitcoinJS.payments.p2sh({ redeem: p2wsh, network });

  // const { address } = bitcoinJS.payments.p2sh({
  //   redeem: bitcoinJS.payments.p2wsh({
  //     redeem: bitcoinJS.payments.p2ms({
  //       m: required,
  //       pubkeys,
  //     }),
  //   }),
  // });

  return {
    p2wsh,
    p2sh,
    address: p2sh.address,
  };
};

const fetchTxnFeeRate = async () => {
  // provides transation fee rate (satoshis/kilobyte)
  // bitcoinfees endpoint: https://bitcoinfees.earn.com/api/v1/fees/recommended (provides time estimates)

  if (network === bitcoinJS.networks.testnet) {
    const { data } = await axios.get(TESTNET.TX_FEE_RATE);
    return data;
  }
  const { data } = await axios.get(MAINNET.TX_FEE_RATE);
  return data;
};

const fetchUnspentOutputs = async (address) => {
  let data;
  if (network === bitcoinJS.networks.testnet) {
    const res = await axios.get(`${TESTNET.UNSPENT_OUTPUTS}${address}`);
    data = res.data;
  } else {
    const res = await axios.get(`${MAINNET.UNSPENT_OUTPUTS}${address}`);
    data = res.data;
  }

  let { unspent_outputs } = data;
  if (unspent_outputs.length === 0) throw new Error('No UTXO found for the supplied address');

  unspent_outputs = unspent_outputs.map(unspent => ({
    txId: unspent.tx_hash_big_endian,
    vout: unspent.tx_output_n,
    value: unspent.value,
  }));
  return unspent_outputs;
};

const createTransaction = async ({
  senderAddress,
  recipientAddress,
  amount,
}) => {
  const inputUTXOs = await fetchUnspentOutputs(senderAddress);
  const outputUTXOs = [{ address: recipientAddress, value: amount }];
  const feeRates = await fetchTxnFeeRate();
  // console.log('Current feeRates:', feeRates);
  const medium_fee_per_byte = feeRates.medium_fee_per_kb / 1000;
  const { inputs, outputs, fee } = coinselect(inputUTXOs, outputUTXOs, medium_fee_per_byte);

  console.log('-------Transaction--------');
  console.log('\tFee', fee);
  console.log('\tInputs:', inputs);
  console.log('\tOutputs:', outputs);

  const txb = new bitcoinJS.TransactionBuilder(network);

  inputs.forEach(input => txb.addInput(input.txId, input.vout));
  outputs.forEach((output) => {
    // Outputs may have been added that needs an
    // output address/script (generating change)
    if (!output.address) {
      output.address = senderAddress;
    }
    console.log('Added Output:', output);
    txb.addOutput(output.address, output.value);
  });

  return {
    inputs,
    txb,
  };
};

const signTransaction = ({
  inputs, txb, keyPairs, redeemScript, witnessScript,
}) => {
  let vin = 0;
  inputs.forEach((input) => {
    keyPairs.forEach((keyPair) => {
      txb.sign(
        vin,
        keyPair,
        redeemScript, // multiSig.p2sh.redeem.output
        null,
        input.value,
        witnessScript, // multiSig.p2wsh.redeem.output
      );
    });
    vin += 1;
  });

  const txHash = txb.build().toHex();
  return txHash;
};

const broadcastTransaction = async (txHash) => {
  if (network === bitcoinJS.networks.testnet) {
    const { data } = await axios.post(TESTNET.BROADCAST, { hex: txHash });
    return data;
  }
  const { data } = await axios.post(MAINNET.BROADCAST, { hex: txHash });
  return data;
};

const decodeTransaction = async (txHash) => {
  if (network === bitcoinJS.networks.testnet) {
    const { data } = await axios.post(TESTNET.TX_DECODE, { hex: txHash });
    console.log(JSON.stringify(data, null, 4));
  }
  const { data } = await axios.post(MAINNET.TX_DECODE, { hex: txHash });
  console.log(JSON.stringify(data, null, 4));
};

module.exports = {  
  createHDWallet,
  generateHDWallet,
  checkBalance,
  fetchTransactions,
  getP2SH,
  generateMultiSig,
  createTransaction,
  signTransaction,
  broadcastTransaction,
};

// ////////// SMOKE TEST ZONE /////////////////

// fetchUnspentOutputs('15QcWutP4pY527grztH7ispWqDsC6p6CeP').then(console.log);
// createTransaction({
//   network: bitcoinJS.networks.testnet,
// });

// fundTestNetAddress(getAddress(generateTestnetKeys()), 3000);

// fetchTxnFeeRate().then(console.log);
// fetchTransactions('2NFb3TpSctXBdax6pJaPaAuJG9tKzuihCrz', bitcoinJS.networks.testnet).then(console.log);
// checkBalance('2NFb3TpSctXBdax6pJaPaAuJG9tKzuihCrz').then(console.log);

const testnetTxn = async () => {
  const keyPair = generateTestnetKeys(rng1);
  const p2sh = getP2SH(keyPair);

  // checking available funds against the given address
  const balance = await checkBalance(p2sh.address);
  console.log('Balance:', balance);

  // const outputUTXOs = [{ address: getAddress(generateTestnetKeys(), multiSig.network), value: 3e4 }];
  const txnObj = await createTransaction({
    senderAddress: p2sh.address,
    recipientAddress: getAddress(generateTestnetKeys(rng2)),
    amount: 3e4,
  });
  console.log('Transaction Object:', txnObj);

  const txnHash = signTransaction({
    inputs: txnObj.inputs,
    txb: txnObj.txb,
    keyPairs: [keyPair],
    redeemScript: p2sh.redeem.output,
  });
  console.log('Transaction Hash', txnHash);
  const res = await broadcastTransaction(txnHash);
  console.log(res);
};

const testnetMultiSigTxn = async () => {
  const keyPairs = [generateTestnetKeys(rng1), generateTestnetKeys(rng2)];
  const pubKeys = keyPairs.map(x => x.publicKey);
  const multiSig = generateMultiSig({
    required: keyPairs.length,
    pubKeys,
  });

  // Using same testnet addresses to derive a deterministic multisig address
  // which is explicitly funded
  console.log('MultiSig Address', multiSig.address);


  // checking for funds in the multiSig
  const balance = await checkBalance(multiSig.address);
  console.log('MultiSig Balance:', balance);

  // await fundTestNetAddress(multiSig.address, 1e5); (api not working at this moment)
  // fetchUnspentOutputs(multiSig.network, multiSig.address).then(console.log);

  // const outputUTXOs = [{ address: getAddress(generateTestnetKeys(), multiSig.network), value: 3e4 }];
  const txnObj = await createTransaction({
    senderAddress: multiSig.address,
    recipientAddress: getAddress(generateTestnetKeys()),
    amount: 3e4,
  });
  console.log('Transaction Object:', txnObj);

  const txnHash = signTransaction({
    inputs: txnObj.inputs,
    txb: txnObj.txb,
    keyPairs,
    redeemScript: multiSig.p2sh.redeem.output,
    witnessScript: multiSig.p2wsh.redeem.output,
  });
  console.log('Transaction Hash', txnHash);
  const res = await broadcastTransaction(txnHash);
  console.log(res);
  // decodeTransaction(txnHash);
};
   
// testnetTxn();
// testnetMultiSigTxn();
