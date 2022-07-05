const fs = require("fs");

const { MerkleTree } = require("merkletreejs");

const keccak256 = require("keccak256");

const conf = require("../migration-parameters");

const waddr = JSON.parse(fs.readFileSync("../migration-whitelist.json"));

module.exports = async () => {
    try {
      const network = config.network;
      let leaves = {};
      let c = {};
      // loading proper conf object
      switch (network) {
        case "rinkeby":
          c = { ...conf.rinkeby };
          leaves = c.whitelist.map((addr) => keccak256(addr));
          break;
        case "mainnet":
          leaves = waddr.map((addr) => keccak256(addr));
          break;
        case "development":
        default:
          c = { ...conf.devnet };
          leaves = c.whitelist.map((addr) => keccak256(addr));
      }
      
      const tree = new MerkleTree(
        leaves,
        keccak256,
        (options = { sortPairs: true })
      );
  
      fs.writeFileSync("./merkle/tree.json", JSON.stringify(tree));
  
      fs.writeFileSync("./merkle/root.dat", tree.getHexRoot());
  
      fs.writeFileSync("../frontend/src/merkle/tree.json", JSON.stringify(tree));
  
      console.log("Merkle Tree Generated");
      process.exit();
    } catch (error) {
      console.log(error);
    }
  };