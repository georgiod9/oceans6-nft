const oceanSixCont = artifacts.require("OceanSix721");

const conf = require("../migration-parameters");

module.exports = async () => {
    const erc721 = await oceanSixCont.deployed();

    let gasUsedTotal = 0;
    let c = {};
    switch (network) {
        case "rinkeby":
            c = { ...conf.rinkeby };
            break;
        case "mainnet":
            c = { ...conf.mainnet };
        case "development":
        default:
            c = { ...conf.devnet };
            break;
    }

    const owner = c.owner;

    console.log(`Transfer 721 Ownership to ${owner}`);
    const tx1 = await erc721.transferOwnership(owner);
    gasUsedTotal += tx1.receipt.cumulativeGasUsed;
    console.log(tx1.tx);
    console.log("----------------------\n");

    console.log(
        "Transfer ownerships cost in eth: ",
        (gasUsedTotal * 100)/100000000
    );
}