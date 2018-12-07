const bitcoinJS = require('bitcoinjs-lib');

const ENVIRONMENT = 'DEV'; // for testnet
// const ENVIRONMENT = "PROD" // for mainnet

const NETWORK = ENVIRONMENT === 'PROD' ? bitcoinJS.networks.bitcoin : bitcoinJS.networks.testnet;

const API_URLS = {
  TESTNET: {
    BALANCE_CHECK: 'https://testnet.blockchain.info/balance?active=',
    TX_FEE_RATE: 'https://api.blockcypher.com/v1/btc/test3',
    UNSPENT_OUTPUTS: 'https://testnet.blockchain.info/unspent?active=',
    BROADCAST: 'https://testnet-api.smartbit.com.au/v1/blockchain/pushtx',
    TX_DECODE: 'https://testnet-api.smartbit.com.au/v1/blockchain/decodetx',
    TX_FETCH: {
      URL: 'https://testnet.blockchain.info/rawaddr/',
      LIMIT: '?limit=',
    },
    FUND: {
      URL: 'https://api.blockcypher.com/v1/btc/test3/faucet?token=',
      TOKEN: '0d55b026eb934aa8b4de8a11bdcc16f1',
    },
  }, 
  MAINNET: {
    BALANCE_CHECK: 'https://blockchain.info/balance?active=',
    TX_FEE_RATE: 'https://api.blockcypher.com/v1/btc/main',
    UNSPENT_OUTPUTS: 'https://blockchain.info/unspent?active=',
    BROADCAST: 'https://api.smartbit.com.au/v1/blockchain/pushtx',
    TX_DECODE: 'https://api.smartbit.com.au/v1/blockchain/decodetx',
    TX_FETCH: {
      URL: 'https://blockchain.info/rawaddr/',
      LIMIT: '?limit=',
    },
  },
};

module.exports = {
  NETWORK,
  API_URLS,
};  
