const StakeHoldersPoolCont = artifacts.require("StakeHoldersPool");

const conf = require("../migration-parameters");

const { setEnvValue } = require("../utils/env-man");

const setFrontEndEnv = (n, v) => 
    setEnvValue(
        "../../frontend",
        `REACT_APP_STAKEHOLDERSPOOL_ADDRESS_${n.toUpperCase()}`,
        v
    );

module.exports = async (deployer, network, accounts) => {
    // load proper conf object
    switch (network) {
        case "rinkeby":
            c = { ...conf.rinkeby };
            break;
        case "mainnet":
            c = { ...conf.mainnet };
        case "developement":
        default:
            c = { ...conf.devnet };
    }
    c.token.admin = accounts[0];

    //deploy stake holders pool
    await deployer.deploy(StakeHoldersPoolCont, c.StakeHoldersPool.payees, c.StakeHoldersPool.shares);

    const cont = await StakeHoldersPoolCont.deployed();

    if(cont) {
        console.log(
            `Deployed: StakeHoldersPool \n network: ${network} \n address: ${cont.address} \n`
        );
        setFrontEndEnv(network, cont.address);
    } else {
        console.log("StakeHoldersPool Deployment UNSUCCESFUL");
    }
}