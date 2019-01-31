import Bitcoin from "../utilities/Bitcoin";
import twoFactorAuthentication from "../utilities/TwoFactorAuthentication";

class WalletService {
  public bitcoin: Bitcoin;
  public twoFA: twoFactorAuthentication;
  constructor() {
    this.bitcoin = new Bitcoin();
    this.twoFA = new twoFactorAuthentication();
  }

  public createWallet = (passphrase?: string) =>
    this.bitcoin.createHDWallet(passphrase)

  public importWallet = (mnemonic: string, passphrase?: string) =>
    this.bitcoin.generateHDWallet(mnemonic, passphrase)

  public getBalance = async (address: string) =>
    await this.bitcoin.checkBalance(address)

  public getTransactionDetails = async (txHash: string) =>
    await this.bitcoin.fetchTransactionDetails(txHash)

  public getTransactions = async (address: string) =>
    await this.bitcoin.fetchTransactions(address)

  public getPubKey = async (privKey: string) => {
    const keyPair = await this.bitcoin.getKeyPair(privKey);
    return keyPair.publicKey;
  }

  public multisigTransaction = async (
    senderAddress: string,
    recipientAddress: string,
    amount: number,
    privateKey: string,
    p2sh: any,
    p2wsh: any,
  ) => await this.bitcoin.multisigTransaction(senderAddress, recipientAddress, amount, privateKey, p2sh, p2wsh)

  public completeMultisigTransaction = async (txHex: string, inputs: any, privateKey: string, p2sh: any, p2wsh: any) =>
    await this.bitcoin.completeMultisigTransaction(txHex, inputs, privateKey, p2sh, p2wsh)

  public createMultiSig = (required: number, pubKeys: string[]) => {
    if (required <= 0 || required > pubKeys.length) {
      throw new Error("Inappropriate value for required param");
    }
    return this.bitcoin.generateMultiSig(required, pubKeys);
  }

  public transfer = async (
    senderAddress: string,
    recipientAddress: string,
    amount: number,
    privateKey: string,
  ) => {
    const balance = await this.bitcoin.checkBalance(senderAddress);
    if (parseInt(balance.final_balance, 10) <= amount) {
      // logic for fee inclusion can also be accomodated
      throw new Error("Insufficient balance");
    }

    const txnObj = await this.bitcoin.createTransaction(
      senderAddress,
      recipientAddress,
      amount,
    );
    console.log("---- Transaction Created ----");

    const keyPair = this.bitcoin.getKeyPair(privateKey);
    const p2sh = this.bitcoin.getP2SH(keyPair);
    const txnHash = this.bitcoin.signTransaction(
      txnObj.inputs,
      txnObj.txb,
      [keyPair],
      p2sh.redeem.output,
    );
    console.log("---- Transaction Signed ----");

    const res = await this.bitcoin.broadcastTransaction(txnHash);
    console.log("---- Transaction Broadcasted ----");

    return res;
  }

  public generate2faQR = async (userID: string) => this.twoFA.generator(userID);
  public validate2faToken = async (secret: string, token: string) =>
    this.twoFA.validator(secret, token)
}

export default new WalletService();

class SmokeTest {
  public walletService: WalletService;
  constructor() {
    this.walletService = new WalletService();
  }

  public testCycle = async () => {
    // 1. Import an HD Wallet (With a pre-funded address)
    const mnemonic =
      "spray danger ostrich volume soldier scare shed excess jeans scheme hammer exist";
    const { address, privateKey } = this.walletService.importWallet(mnemonic);
    // 2. Fund the account (for testing transfer fxn) // Already funded

    // 3. Transfer
    const { success, txid } = await this.walletService.transfer(
      address,
      "2NFb3TpSctXBdax6pJaPaAuJG9tKzuihCrz",
      3e4,
      privateKey,
    );

    if (success) {
      console.log("Transaction successful, here's the transaction ID: ", txid);
    } else {
      throw new Error("Transaction failed, something went wrong!");
    }
  }
}

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

// const ws = new WalletService();
// ws.getTransactions("2NAtR7EZFv9aKo8jkygvioZb8NLKY9acYkd").then(console.log);

// const smokeTest = new SmokeTest();
// smokeTest.testCycle();
