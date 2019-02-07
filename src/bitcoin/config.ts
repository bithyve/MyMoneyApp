import bitcoinJS, { Network } from "bitcoinjs-lib";

class Config {
  public ENVIRONMENT: string;
  public NETWORK: Network;
  public API_URLS = {
    TESTNET: {
      BASE: "https://api.blockcypher.com/v1/btc/test3",
      BALANCE_CHECK: "https://testnet.blockchain.info/balance?active=",
      UNSPENT_OUTPUTS: "https://testnet.blockchain.info/unspent?active=",
      BROADCAST: "https://testnet-api.smartbit.com.au/v1/blockchain/pushtx",
      TX_DECODE: "https://testnet-api.smartbit.com.au/v1/blockchain/decodetx",
      TX_FETCH: {
        URL: "https://testnet.blockchain.info/rawaddr/",
        LIMIT: "?limit=",
      },
      FUND: {
        URL: "https://api.blockcypher.com/v1/btc/test3/faucet?token=",
        TOKEN: "",
      },
    },
    MAINNET: {
      BASE: "https://api.blockcypher.com/v1/btc/main",
      BALANCE_CHECK: "https://blockchain.info/balance?active=",
      UNSPENT_OUTPUTS: "https://blockchain.info/unspent?active=",
      BROADCAST: "https://api.smartbit.com.au/v1/blockchain/pushtx",
      TX_DECODE: "https://api.smartbit.com.au/v1/blockchain/decodetx",
      TX_FETCH: {
        URL: "https://blockchain.info/rawaddr/",
        LIMIT: "?limit=",
      },
    },
  };

  constructor(env: string) {
    this.ENVIRONMENT = env;
    this.setNetwork();
  }

  public setNetwork = (): void => {
    if (this.ENVIRONMENT === "PROD") {
      this.NETWORK = bitcoinJS.networks.bitcoin;
    } else if (this.ENVIRONMENT === "DEV") {
      this.NETWORK = bitcoinJS.networks.testnet;
    } else {
      throw new Error("Please specify an apt environment(PROD||DEV)");
    }
  }
}

export default new Config("DEV");
