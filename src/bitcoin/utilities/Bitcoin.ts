import axios, { AxiosResponse } from "axios";
import bip32 from "bip32";
import bip39 from "bip39";
import bip65 from "bip65";
import bitcoinJS, { ECPair, Network, TransactionBuilder } from "bitcoinjs-lib";
import coinselect from "coinselect";
import request from "superagent";
import Config from "../Config";   
const { TESTNET, MAINNET } = Config.API_URLS;
  
export default class Bitcoin {
  public network: Network;
  constructor() {
    this.network = Config.NETWORK;
  }  

  public getKeyPair = (privateKey: string): ECPair =>
    bitcoinJS.ECPair.fromWIF(privateKey, this.network)

  public utcNow = (): number => Math.floor(Date.now() / 1000);

  public getAddress = (keyPair: ECPair): string =>
    bitcoinJS.payments.p2sh({
      redeem: bitcoinJS.payments.p2wpkh({
        pubkey: keyPair.publicKey,
        network: this.network,
      }),
      network: this.network,
    }).address

  public generateHDWallet = (
    mnemonic: string,
    passphrase?: string,
  ): {
    mnemonic: string;
    keyPair: ECPair;
    address: string;
    privateKey: string;
  } => {
    // generates a HD-Wallet from the provided mnemonic-passphrase pair

    if (!bip39.validateMnemonic(mnemonic)) {
      throw new Error("Invalid mnemonic");
    }

    const seed: Buffer = passphrase
      ? bip39.mnemonicToSeed(mnemonic, passphrase)
      : bip39.mnemonicToSeed(mnemonic);
    const path: string = "m/44'/0'/0'/0/0";
    const root = bip32.fromSeed(seed, this.network);
    const child1 = root.derivePath(path);

    const privateKey = child1.toWIF();
    const address = this.getAddress(child1);

    console.log(`Mnemonic: ${mnemonic}`);
    console.log(`Address: ${address}`);

    return {
      mnemonic,
      keyPair: child1,
      address,
      privateKey,
    };
  }

  public createHDWallet = async (passphrase?: string) => {
    // creates a new HD Wallet

    const mnemonic = await bip39.generateMnemonic();
    return this.generateHDWallet(mnemonic, passphrase);
  }

  public getP2SH = (keyPair: ECPair) =>
    bitcoinJS.payments.p2sh({
      redeem: bitcoinJS.payments.p2wpkh({
        pubkey: keyPair.publicKey,
        network: this.network,
      }),
      network: this.network,
    })

  public checkBalance = async (address: string): Promise<any> => {
    // fetches balance corresponding to the supplied address

    let res: AxiosResponse;
    if (this.network === bitcoinJS.networks.testnet) {
      try {
        res = await axios.get(`${TESTNET.BALANCE_CHECK}${address}`);
      } catch (err) {
        console.log("Error:", err.response.data);
        return {
          statusCode: err.response.status,
          errorMessage: err.response.data,
        };
      }
    } else {
      // throttled endPoint (required: full node/corresponding paid service));
      try {
        res = await axios.get(`${MAINNET.BALANCE_CHECK}${address}`);
      } catch (err) {
        console.log("Error:", err.response.data);
        return {
          statusCode: err.response.status,
          errorMessage: err.response.data,
        };
      }
    }

    const { final_balance, total_received } = res.data[address];
    return {
      statusCode: res.status,
      final_balance,
      total_received,
    };
  }

  // public fetchTransactions = async (
  //   address: string,
  // ): Promise<{
  //   numberOfTransactions: string;
  //   transactions: string[];
  // }> => {
  //   // fetches transactions corresponding to the  supplied address

  //   const txLimit: number = 5; // max:50 (use offset and n_tx to recursively capture all txs, if required)
  //   let res: AxiosResponse;
  //   if (this.network === bitcoinJS.networks.testnet) {
  //     res = await axios.get(
  //       `${TESTNET.TX_FETCH.URL}${address}${TESTNET.TX_FETCH.LIMIT}${txLimit}`,
  //     );
  //   } else {
  //     res = await axios.get(
  //       `${MAINNET.TX_FETCH.URL}${address}${MAINNET.TX_FETCH.LIMIT}${txLimit}`,
  //     );
  //   }
  //   return {
  //     numberOfTransactions: res.data.n_tx,
  //     transactions: res.data.txs,
  //   };
  // }

  public fetchAddressInfo = async (address: string): Promise<any> => {
    // fetches information corresponding to the  supplied address (including txns)
    if (this.network === bitcoinJS.networks.testnet) {
      return await axios.get(`${TESTNET.BASE}/addrs/${address}/full`);
    } else {
      return await axios.get(`${MAINNET.BASE}/addrs/${address}/full`);
    }
  }

  public categorizeTx = (tx: any, walletAddress: string) => {
    // only handling for single walletAddress for now
    const { inputs, outputs } = tx;
    let sent: boolean = false;
    let totalReceived: number = 0;
    let totalSpent: number = 0;

    console.log({inputs, outputs})
    inputs.forEach((input) => {
      const { addresses } = input;
      if(addresses){
        addresses.forEach((address) => {
          if (address === walletAddress) {
            sent = true;
          }
        });
      }  
    });

    outputs.forEach((output) => {
      const { addresses } = output;
      if (addresses[0] !== walletAddress) {
        totalSpent += output.value;
      } else {
        totalReceived += output.value;
      }
    });

    tx.transactionType = sent ? "Sent" : "Received";
    if (sent) {
      tx.totalSpent = totalSpent;
    } else {
      tx.totalReceived = totalReceived;
    }

    console.log({tx})
    return tx;
  }

  public confirmationCat = async (tx: any) => {
    let confirmationType: string;
    const nConfirmations: number = tx.confirmations;
    if (nConfirmations === 0) {
      confirmationType = "UNCONFIRMED";
    } else if (nConfirmations > 0 && nConfirmations < 6) {
      confirmationType = "CONFIRMED";
    } else {
      confirmationType = "SUPER CONFIRMED";
    }

    tx.confirmationType = confirmationType;
    return tx;
  }

  public fetchTransactions = async (address: string): Promise<any> => {
    let res: AxiosResponse;
    try {
      console.log({address});
      res = await this.fetchAddressInfo(address);
      console.log({res});
    } catch (err) {
      return {
        statusCode: err.response.status,
        errorMessage: err.response.data,
      };
    }

    const { final_n_tx, n_tx, unconfirmed_n_tx, txs } = res.data;
    txs.map((tx) => {
      console.log({tx})
      this.confirmationCat(this.categorizeTx(tx, address));
    });

    return {
      statusCode: res.status,
      totalTransactions: final_n_tx,
      confirmedTransactions: n_tx,
      unconfirmedTransactions: unconfirmed_n_tx,
      transactionDetails: txs,
      address,
    };
  }

  // deterministic RNG for testing only (aids in generation of exact address)
  public rng1 = (): Buffer => {
    return Buffer.from("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz1");
  }

  public rng2 = (): Buffer => {
    return Buffer.from("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz2");
  }

  public generateTestnetKeys = (rng?): string => {
    let keyPair: ECPair;
    if (rng) {
      keyPair = bitcoinJS.ECPair.makeRandom({
        network: this.network,
        rng,
      });
    } else {
      // // for generating random testnet addresses
      keyPair = bitcoinJS.ECPair.makeRandom({
        network: this.network,
      });
    }
    const privateKey: string = keyPair.toWIF();
    const address: string = this.getAddress(keyPair);

    console.log(
      `Private Kye[WIF]: ${privateKey} \n Generated Address: ${address} `,
    );
    return privateKey;
  }

  public fundTestNetAddress = async (
    address: string,
    amount: number,
  ): Promise<any> =>
    request // blockcypher faucet doesn't seems to work (insufficient balance in faucet)
      .post(`${TESTNET.FUND.URL}${TESTNET.FUND.TOKEN}`)
      .send({ address, amount })
      .end((err, res) => {
        if (err) {
          console.log(err);
        }
        console.log(res);
      })

  //  generate2of2MultiSigAddress = (pubKey1, pubKey2) => {
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

  public generateMultiSig = (required: number, pubKeys: any[]) => {
    // generic multiSig address generator

    // if (!network) network = bitcoinJS.networks.bitcoin;
    const pubkeys = pubKeys.map((hex) => Buffer.from(hex, "hex"));

    const p2ms = bitcoinJS.payments.p2ms({
      m: required,
      pubkeys,
      network: this.network,
    });
    const p2wsh = bitcoinJS.payments.p2wsh({
      redeem: p2ms,
      network: this.network,
    });
    const p2sh = bitcoinJS.payments.p2sh({
      redeem: p2wsh,
      network: this.network,
    });

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
  }

  public fetchChainInfo = async (): Promise<any> => {
    // provides transation fee rate (satoshis/kilobyte)
    // bitcoinfees endpoint: https://bitcoinfees.earn.com/api/v1/fees/recommended (provides time estimates)

    if (this.network === bitcoinJS.networks.testnet) {
      const { data } = await axios.get(TESTNET.BASE);
      return data;
    } else {
      const { data } = await axios.get(MAINNET.BASE);
      return data;
    }
  }

  public fetchUnspentOutputs = async (address: string): Promise<any> => {
    let data;
    if (this.network === bitcoinJS.networks.testnet) {
      const res: AxiosResponse = await axios.get(
        `${TESTNET.UNSPENT_OUTPUTS}${address}`,
      );
      data = res.data;
    } else {
      const res: AxiosResponse = await axios.get(
        `${MAINNET.UNSPENT_OUTPUTS}${address}`,
      );
      data = res.data;
    }

    let { unspent_outputs } = data;
    if (unspent_outputs.length === 0) {
      throw new Error("No UTXO found for the supplied address");
    }

    unspent_outputs = unspent_outputs.map((unspent) => ({
      txId: unspent.tx_hash_big_endian,
      vout: unspent.tx_output_n,
      value: unspent.value,
    }));
    return unspent_outputs;
  }

  public fetchTransactionDetails = async (txHash: string): Promise<any> => {
    if (this.network === bitcoinJS.networks.testnet) {
      const { data } = await axios.get(`${TESTNET.BASE}/txs/${txHash}`);
      return data;
    } else {
      const { data } = await axios.get(`MAINNET.BASE/txs/${txHash}`);
      return data;
    }
  }

  public createTransaction = async (
    senderAddress: string,
    recipientAddress: string,
    amount: number,
  ): Promise<{ inputs: object[]; txb: TransactionBuilder }> => {
    const inputUTXOs = await this.fetchUnspentOutputs(senderAddress);
    const outputUTXOs = [{ address: recipientAddress, value: amount }];
    const chainInfo = await this.fetchChainInfo();

    const highFeePerByte: number = chainInfo.high_fee_per_kb / 1000;
    console.log("Fee rate:", highFeePerByte);
    const { inputs, outputs, fee } = coinselect(
      inputUTXOs,
      outputUTXOs,
      Math.round(highFeePerByte),
    );

    console.log("-------Transaction--------");
    console.log("\tFee", fee);
    console.log("\tInputs:", inputs);
    console.log("\tOutputs:", outputs);

    const txb: TransactionBuilder = new bitcoinJS.TransactionBuilder(
      this.network,
    );

    inputs.forEach((input) => txb.addInput(input.txId, input.vout));
    outputs.forEach((output) => {
      // Outputs may have been added that needs an
      // output address/script (generating change)
      if (!output.address) {
        output.address = senderAddress;
      }
      console.log("Added Output:", output);
      txb.addOutput(output.address, output.value);
    });

    return {
      inputs,
      txb,
    };
  }

  public createPartialTransaction = async (
    multiSigAddress: string,
  ): Promise<any> => {
    const inputs = await this.fetchUnspentOutputs(multiSigAddress);
    const chainInfo = await this.fetchChainInfo();

    const highFeePerByte: number = chainInfo.high_fee_per_kb / 1000;
    console.log("Fee rate:", highFeePerByte);

    const txb: TransactionBuilder = new bitcoinJS.TransactionBuilder(
      this.network,
    );

    inputs.forEach((input) => txb.addInput(input.txId, input.vout));

    return {
      inputs,
      txb,
    };
  }

  public signTransaction = (
    inputs: any,
    txb: TransactionBuilder,
    keyPairs: ECPair[],
    redeemScript: any,
    witnessScript?: any,
  ): string => {
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
  }

  public signPartialTxn = (
    inputs: any,
    txb: TransactionBuilder,
    keyPairs: ECPair[],
    redeemScript: any,
    witnessScript?: any,
  ): any => {
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

    const txHash = txb.buildIncomplete();
    return txHash;
  }

  public broadcastTransaction = async (txHash: string): Promise<any> => {
    if (this.network === bitcoinJS.networks.testnet) {
      const { data } = await axios.post(TESTNET.BROADCAST, { hex: txHash });
      return data;
    } else {
      const { data } = await axios.post(MAINNET.BROADCAST, { hex: txHash });
      return data;
    }
  }

  public decodeTransaction = async (txHash: string): Promise<void> => {
    if (this.network === bitcoinJS.networks.testnet) {
      const { data } = await axios.post(TESTNET.TX_DECODE, { hex: txHash });
      console.log(JSON.stringify(data, null, 4));
    } else {
      const { data } = await axios.post(MAINNET.TX_DECODE, { hex: txHash });
      console.log(JSON.stringify(data, null, 4));
    }
  }

  public cltvCheckSigOutput(aQ: ECPair, bQ: ECPair, lockTime: any): Buffer {
    return bitcoinJS.script.compile([
      bitcoinJS.opcodes.OP_IF,
      bitcoinJS.script.number.encode(lockTime),
      bitcoinJS.opcodes.OP_CHECKLOCKTIMEVERIFY,
      bitcoinJS.opcodes.OP_DROP,

      bitcoinJS.opcodes.OP_ELSE,
      bQ.publicKey,
      bitcoinJS.opcodes.OP_CHECKSIGVERIFY,
      bitcoinJS.opcodes.OP_ENDIF,

      aQ.publicKey,
      bitcoinJS.opcodes.OP_CHECKSIG,
    ]);
  }

  public createTLC = async (
    keyPair1: ECPair,
    keyPair2: ECPair,
    time: number,
    blockHeight: number,
  ): Promise<string> => {
    let lockTime: any;
    if (time && blockHeight) {
      throw new Error("You can't specify time and block height together");
    } else if (time) {
      lockTime = bip65.encode({ utc: this.utcNow() + time }); // time should be specified in seconds (ex: 3600 * 3)
    } else if (blockHeight) {
      const chainInfo = await this.fetchChainInfo();
      lockTime = bip65.encode({ blocks: chainInfo.height + blockHeight });
    } else {
      throw new Error("Please specify time or block height");
    }

    const redeemScript = this.cltvCheckSigOutput(keyPair1, keyPair2, lockTime);
    // const { address } = bitcoinJS.payments.p2sh({
    //  redeem: { output: redeemScript, network: regtest },
    //  network: regtest });
    const { address } = bitcoinJS.payments.p2sh({
      redeem: bitcoinJS.payments.p2wsh({
        redeem: { output: redeemScript },
        network: this.network,
      }),
      network: this.network,
    });

    return address;
  }
}
class SmokeTest {
  private bitcoin: Bitcoin;
  constructor() {
    this.bitcoin = new Bitcoin();
  }

  public testnetTxn = async (): Promise<void> => {
    const privateKey = this.bitcoin.generateTestnetKeys(this.bitcoin.rng1);
    const keyPair = this.bitcoin.getKeyPair(privateKey);
    const p2sh = this.bitcoin.getP2SH(keyPair);
    console.log({ privateKey, keyPair, p2sh });

    // checking available funds against the given address
    const balance = await this.bitcoin.checkBalance(p2sh.address);
    console.log("Balance:", balance);

    // const outputUTXOs = [{ address: getAddress(generateTestnetKeys(), multiSig.network), value: 3e4 }];
    const txnObj = await this.bitcoin.createTransaction(
      p2sh.address,
      this.bitcoin.getAddress(
        this.bitcoin.getKeyPair(
          this.bitcoin.generateTestnetKeys(this.bitcoin.rng2),
        ),
      ),
      3e4,
    );
    console.log("Transaction Object:", txnObj);

    const txnHash = this.bitcoin.signTransaction(
      txnObj.inputs,
      txnObj.txb,
      [keyPair],
      p2sh.redeem.output,
    );
    console.log("Transaction Hash", txnHash);
    const res = await this.bitcoin.broadcastTransaction(txnHash);
    console.log(res);
  }

  public testnetMultiSigTxn = async (): Promise<void> => {
    const privateKeys = [
      this.bitcoin.generateTestnetKeys(this.bitcoin.rng1),
      this.bitcoin.generateTestnetKeys(this.bitcoin.rng2),
    ];
    const keyPairs = privateKeys.map((privateKey) =>
      this.bitcoin.getKeyPair(privateKey),
    );
    // console.log({ privateKeys, keyPairs });
    const pubKeys = keyPairs.map((keyPair) => keyPair.publicKey);
    const multiSig = this.bitcoin.generateMultiSig(keyPairs.length, pubKeys);

    // Using same testnet addresses to derive a deterministic multisig address
    // which is explicitly funded
    console.log("MultiSig Address", multiSig.address);

    // checking for funds in the multiSig
    const balance = await this.bitcoin.checkBalance(multiSig.address);
    console.log("MultiSig Balance:", balance);

    // await fundTestNetAddress(multiSig.address, 1e5); (api not working at this moment)
    // fetchUnspentOutputs(multiSig.network, multiSig.address).then(console.log);

    // const outputUTXOs = [{ address: getAddress(generateTestnetKeys(), multiSig.network), value: 3e4 }];
    const txnObj = await this.bitcoin.createTransaction(
      multiSig.address,
      this.bitcoin.getAddress(
        this.bitcoin.getKeyPair(
          this.bitcoin.generateTestnetKeys(this.bitcoin.rng1),
        ),
      ),
      3e4,
    );
    console.log("Transaction Object:", txnObj);

    const txnHash = this.bitcoin.signTransaction(
      txnObj.inputs,
      txnObj.txb,
      keyPairs,
      multiSig.p2sh.redeem.output,
      multiSig.p2wsh.redeem.output,
    );
    console.log("Transaction Hash", txnHash);
    const res = await this.bitcoin.broadcastTransaction(txnHash);
    console.log(res);
    // decodeTransaction(txnHash);
  }

  // testnetTxn();
  // testnetMultiSigTxn();

  public testingTimelocks = async () => {
    const chainInfo = await this.bitcoin.fetchChainInfo();
    console.log("Current block height:", chainInfo);
    const lockTime = bip65.encode({ blocks: chainInfo.height + 5 });

    const alice = bitcoinJS.ECPair.fromWIF(
      "cScfkGjbzzoeewVWmU2hYPUHeVGJRDdFt7WhmrVVGkxpmPP8BHWe",
      this.bitcoin.network,
    );
    const bob = bitcoinJS.ECPair.fromWIF(
      "cMkopUXKWsEzAjfa1zApksGRwjVpJRB3831qM9W4gKZsLwjHXA9x",
      this.bitcoin.network,
    );

    const redeemScript = this.bitcoin.cltvCheckSigOutput(alice, bob, lockTime);
    const { address } = bitcoinJS.payments.p2sh({
      redeem: { output: redeemScript, network: this.bitcoin.network },
      network: this.bitcoin.network,
    });
  }

  public testingPartialTxn = async () => {
    const privateKeys = [
      this.bitcoin.generateTestnetKeys(this.bitcoin.rng1),
      this.bitcoin.generateTestnetKeys(this.bitcoin.rng2),
    ];
    const keyPairs = privateKeys.map((privateKey) =>
      this.bitcoin.getKeyPair(privateKey),
    );
    // console.log({ privateKeys, keyPairs });
    const pubKeys = keyPairs.map((keyPair) => keyPair.publicKey);
    const multiSig = this.bitcoin.generateMultiSig(keyPairs.length, pubKeys);

    // Using same testnet addresses to derive a deterministic multisig address
    // which is explicitly funded
    console.log("MultiSig Address", multiSig.address);

    // checking for funds in the multiSig
    const balance = await this.bitcoin.checkBalance(multiSig.address);
    console.log("MultiSig Balance:", balance);

    const { inputs, txb } = await this.bitcoin.createPartialTransaction(
      multiSig.address,
    );
    console.log("------------------");
    console.log("Unsigned Partial Txn:", txb.buildIncomplete());
    const tx = this.bitcoin.signPartialTxn(
      inputs,
      txb,
      keyPairs,
      multiSig.p2sh.redeem.output,
      multiSig.p2wsh.redeem.output,
    );

    console.log("Signed Partial Txn:", tx.toHex());
  }
}

////////// SMOKE TEST ZONE /////////////////

// const bitcoin = new Bitcoin();
// bitcoin.fetchUnspentOutputs('15QcWutP4pY527grztH7ispWqDsC6p6CeP').then(console.log);

// bitcoin.fundTestNetAddress(bitcoin.getAddress(bitcoin.getKeyPair(bitcoin.generateTestnetKeys())), 3000);

// bitcoin
//   .fetchAddressInfo("2NFb3TpSctXBdax6pJaPaAuJG9tKzuihCrz")
//   .then(console.log);

// bitcoin.checkBalance('2NFb3TpSctXBdax6pJaPaAuJG9tKzuihCrz').then(console.log);

// bitcoin.fetchChainInfo().then(console.log);

// const smokeTest = new SmokeTest();
// smokeTest.testnetTxn();
// smokeTest.testnetMultiSigTxn();

///// TESTING PARTIALLY BUILT TXNS /////

// const smokeTest = new SmokeTest();
// smokeTest.testingPartialTxn();

// const bitcoin = new Bitcoin();
// bitcoin
//   .fetchUnspentOutputs("2NFb3TpSctXBdax6pJaPaAuJG9tKzuihCrz")
//   .then(console.log);
// bitcoin
//   .fetchTransactionDetails(
//     "b0a51b5bc6197a568cba195009acde9f943de36a57bb1a8d1a71ba5c17edf6d9",
//   )
//   .then(console.log);
