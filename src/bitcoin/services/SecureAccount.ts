import axios from "axios";
import bip32 from "bip32";
import bip39 from "bip39";
import { ECPair } from "bitcoinjs-lib";
import crypto from "crypto";
import config from "../Config";
import Bitcoin from "../utilities/Bitcoin";

const { BH_SERVER } = config.API_URLS;

class SecureAccount {
  public bitcoin: Bitcoin;
  public primaryMnemonic: string;
  constructor(primaryMnemonic: string) {
    this.bitcoin = new Bitcoin();
    this.primaryMnemonic = primaryMnemonic;
  }

  public getRecoveryMnemonic = async () => {
    const recoveryMnemonic = await bip39.generateMnemonic();
    return recoveryMnemonic;
  }

  public getRecoverableXPub = (mnemonic: string, childIndex: number = 0) => {
    const seed = bip39.mnemonicToSeed(mnemonic);
    const root = bip32.fromSeed(seed, this.bitcoin.network);
    const path = config.WALLET_XPUB_PATH + childIndex;
    const xpub = root
      .derivePath(path)
      .neutered()
      .toBase58();
    return xpub;
  }

  public getXpriv = (mnemonic: string, childIndex: number = 0) => {
    const seed = bip39.mnemonicToSeed(mnemonic);
    const root = bip32.fromSeed(seed, this.bitcoin.network);
    const path = config.WALLET_XPUB_PATH + childIndex;
    const xpriv = root.derivePath(path).toBase58();
    return xpriv;
  }

  public deriveChildXKey = (extendedKey: string, childIndex: number) => {
    // non-functional; have to execute direct derivation from the master key

    const xKey = bip32.fromBase58(extendedKey, this.bitcoin.network);
    return xKey.derivePath("/" + childIndex);
  }

  public getPub = (extendedKey: string) => {
    const xKey = bip32.fromBase58(extendedKey, this.bitcoin.network);
    return xKey.publicKey.toString("hex");
  }

  public getAssets = async (childIndex: number = 0) => {
    const recoveryMnemonic = await this.getRecoveryMnemonic();

    const primaryXpub = this.getRecoverableXPub(
      this.primaryMnemonic,
      childIndex,
    );
    const primaryXpriv = this.getXpriv(this.primaryMnemonic);

    const recoveryXpub = this.getRecoverableXPub(recoveryMnemonic, childIndex);

    const hash = crypto.createHash("sha512");
    const seed = bip39.mnemonicToSeed(this.primaryMnemonic);
    hash.update(seed);
    const walletID = hash.digest("hex");

    return {
      recoveryMnemonic,
      xpubs: {
        primary: primaryXpub,
        recovery: recoveryXpub,
      },
      xpriv: {
        primary: primaryXpriv,
      },
      walletID,
    };
  }

  public createSecureMultiSig = ({ xpubs }, bhXpub: string) => {
    const childPrimaryPub = this.getPub(xpubs.primary);
    const childRecoveryPub = this.getPub(xpubs.recovery);
    const childBHPub = this.getPub(bhXpub);

    const pubs = [childPrimaryPub, childRecoveryPub, childBHPub];
    const multiSig = this.bitcoin.generateMultiSig(2, pubs);

    return multiSig;
  }

  public setupSecureAccount = async () => {
    const assets = await this.getAssets();
    let res;
    try {
      res = await axios.get(BH_SERVER.PROD + "/setup2FA");
    } catch (err) {
      return {
        err: err.response.data,
      };
    }
    const initMultiSig = this.createSecureMultiSig(assets, res.data.bhXpub);
    return { ...assets, dataSA: res.data, multiSig: initMultiSig };
  }

  public validateSecureAccountSetup = async (
    token: number,
    secret: string,
    walletID: string,
  ) => {
    try {
      const { data } = await axios.post(BH_SERVER.PROD, {
        token,
        secret,
        walletID,
      });
      return data;
    } catch (err) {
      return {
        err: err.response.data,
      };
    }
  }

  public secureTransaction = async ({
    senderAddress,
    recipientAddress,
    amount,
    primaryXpriv,
    multiSig,
    token,
    walletID,
    childIndex = 0,
  }: {
    senderAddress: string;
    recipientAddress: string;
    amount: number;
    primaryXpriv: string;
    multiSig: any;
    token: number;
    walletID: string;
    childIndex: number;
  }) => {
    const balance = await this.bitcoin.checkBalance(senderAddress);
    console.log({ balance });
    if (parseInt(balance.final_balance, 10) <= amount) {
      // logic for fee inclusion can also be accomodated
      throw new Error("Insufficient balance");
    }

    console.log("---- Creating Transaction ----");
    const { inputs, txb } = await this.bitcoin.createTransaction(
      senderAddress,
      recipientAddress,
      amount,
    );

    console.log("---- Transaction Created ----");

    const signedTxb = this.bitcoin.signTransaction(
      inputs,
      txb,
      [bip32.fromBase58(primaryXpriv, this.bitcoin.network)],
      multiSig.p2sh.redeem.output,
      multiSig.p2wsh.redeem.output,
    );
    console.log(
      "---- Transaction Signed by User (1st sig for 2/3 MultiSig)----",
    );
    const txHex = signedTxb.buildIncomplete().toHex();
    console.log(txHex);

    try {
      const { data } = await axios.post(BH_SERVER.PROD + "/secureTranasction", {
        walletID,
        token,
        txHex,
        childIndex,
      });
      console.log(
        "---- Transaction Signed by BH Server (2nd sig for 2/3 MultiSig)----",
      );
      console.log(data.txHex);
      console.log("------ Broadcasting Transaction --------");
      const txHash = await this.bitcoin.broadcastLocally(data.txHex); // TODO: globally expose the tesnet RPC (via ngRox maybe)
      console.log("Transaction successful, txHash:", txHash);
    } catch (err) {
      console.log("An error occured:", err.response.data);
    }
  }
}

export default SecureAccount;

class SmokeTest {
  public secureAccount: SecureAccount;
  public primaryMnemonic =
    "much false truck sniff extend infant pony venture path imitate tongue pluck";

  constructor() {
    this.secureAccount = new SecureAccount(this.primaryMnemonic);
  }

  public testAssets = () => {
    const recoveryMnemonic =
      "frost drive safe pause come apology jungle fortune myself stable talent country";

    const bhMnemonic =
      "aware illness leaf birth raise puzzle start search vivid nephew accuse tank";

    const primarySeed = bip39.mnemonicToSeed(
      this.secureAccount.primaryMnemonic,
    );
    const primaryRoot = bip32.fromSeed(
      primarySeed,
      this.secureAccount.bitcoin.network,
    );

    const hash = crypto.createHash("sha512");
    hash.update(primarySeed);
    const walletID = hash.digest("hex");
    console.log({ walletID });

    const recoverySeed = bip39.mnemonicToSeed(recoveryMnemonic);
    const recoveryRoot = bip32.fromSeed(
      recoverySeed,
      this.secureAccount.bitcoin.network,
    );

    // to be recieved from the server while setting up the secure account
    const bhSeed = bip39.mnemonicToSeed(bhMnemonic);
    const bhRoot = bip32.fromSeed(bhSeed, this.secureAccount.bitcoin.network);
    // const childBHXPub = bhRoot.derivePath(config.BH_XPUB_PATH);
    const xpubBH = bhRoot.neutered();
    // xpubBH.index = 1; // setting childNum to 1; as it's going to be used by the ga_recovery_tool
    // this is the master XPub

    return {
      walletID,
      primaryRoot,
      recoveryRoot,
      xpubBH: xpubBH.toBase58(),
    };
  }

  public getTestMultiSig = (pointer: number = 0) => {
    const assets = this.testAssets();
    const xpubBH = bip32.fromBase58(
      assets.xpubBH,
      this.secureAccount.bitcoin.network,
    ); // provided by the server
    console.log("here");
    const path = config.WALLET_XPUB_PATH + "/" + pointer;

    const primaryChildXpriv = assets.primaryRoot.derivePath(path);
    const recoveryChildXpriv = assets.recoveryRoot.derivePath(path);

    const childXpubBH = xpubBH.derivePath("m/" + pointer);

    const primaryChildPub = primaryChildXpriv.publicKey.toString("hex");
    const recoveryChildPub = recoveryChildXpriv.publicKey.toString("hex");
    const childPubBH = childXpubBH.publicKey.toString("hex");

    const pubs = [childPubBH, primaryChildPub, recoveryChildPub];
    console.log({ childPubBH, primaryChildPub, recoveryChildPub });

    const bitcoin = new Bitcoin();
    const multiSig = bitcoin.generateMultiSig(2, pubs);

    return {
      multiSig,
      primaryChildXpriv: primaryChildXpriv.toBase58(), // store xpubs & xprivs in base58
      pointer,
      walletID: assets.walletID,
    };
  }

  // public testSecureTransaction = async (token: number) => {
  //   const {
  //     multiSig,
  //     primaryChildXpriv,
  //     pointer,
  //     walletID,
  //   } = this.getTestMultiSig();

  //   this.secureAccount.secureTransaction({
  //     senderAddress: multiSig.address,
  //     recipientAddress: "2N4qBb5f1KyfbpHxtLM86QgbZ7qcxsFf9AL",
  //     amount: 4500,
  //     primaryXpriv: primaryChildXpriv,
  //     multiSig,
  //     token,
  //     childIndex: pointer,
  //     walletID,
  //   });
  // }

  public testSecureAccountFlow = async (token?: number) => {
    const secureAccountData = await this.secureAccount.setupSecureAccount();
    console.log(secureAccountData);
  }
}

////// SMOKE TEST ZONE //////
// const smokeTest = new SmokeTest();
// // smokeTest.testSecureTransaction(parseInt(process.argv[2], 10));
// smokeTest.testSecureAccountFlow();
