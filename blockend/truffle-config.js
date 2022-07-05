const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');

const infuraKey = "6bbda6b0d47f472ba14164bf68c202db";

const key_TESTNET = fs.readFileSync(".test.secret").toString().trim();
const key_MAINNET = fs.readFileSync(".main.secret").toString().trim();

module.exports = {
  contracts_build_directory: '../frontend/src/abi',
  networks: {
    development: {
     host: "127.0.0.1",    
     port: 8545,                 
     gas: 5500000,
     gasPrice: 80000000000, // 80
     network_id: "*",      
    },
    rinkeby: {
      provider: () => new HDWalletProvider({ privateKeys: [key_TESTNET], providerOrUrl: `wss://rinkeby.infura.io/ws/v3/${infuraKey}`}),
      network_id: 4,       
      gas: 7500000,        
      confirmations: 1, 
      gasPrice: 100000000000, // 70
      timeoutBlocks: 200,  
      skipDryRun: true     
    },
    mainnet: {
      provider: () => new HDWalletProvider({ privateKeys: [key_MAINNET], providerOrUrl: `wss://mainnet.infura.io/ws/v3/${infuraKey}`}),
      network_id: 1,       
      gas: 5500000, 
      gasPrice: 75000000000, // 100
      confirmations: 1,  
      timeoutBlocks: 400,  
      skipDryRun: true  
    },
  },
  mocha: { },
  plugins: ['truffle-plugin-verify'],
    api_keys: {
      etherscan: 'VW5VF2N2JG2YCSGWSRKYXXAZE2EDQ9H1U7'
  },
  compilers: {
    solc: {
      version: "0.8",    
      settings: {        
       optimizer: {
         enabled: true,
         runs: 200
       },
      }
    },
    
  },
  db: {
    enabled: false
  }
};