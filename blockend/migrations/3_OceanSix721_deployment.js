const oceanSixCont = artifacts.require("OceanSix721");
const StakeHoldersPoolCont = artifacts.require("StakeHoldersPool");

const fs = require("fs");

const conf = require("../migration-parameters");

const { setEnvValue } = require("../utils/env-man");

const setFrontEndEnv = (n, v) => 
    setEnvValue(
        "../../frontend/",
        `REACT_APP_OCEANSIX721_ADDRESS_${n.toUpperCase()}`,
        v
    );

module.exports = async (deployer, network, accounts) => {
    const handleRinkeBy = () => {
        return { ...conf.rinkeby };
    };
    const handleMainnet = () => {
        return { ...conf.mainnet };
    };
    const handleDevelopment = () => {
        return { ...conf.devnet };
    };

    const networks = {
        rinkeby: handleRinkeBy,
        mainnet: handleMainnet,
        development: handleDevelopment,
    };

    //loading proper conf object
    let c = networks[network]();

    c.token.admin = accounts[0];
    
    c.oceansix.merkleRoot = fs.readFileSync("./merkle/root.dat").toString();

    c.oceansix.mBeneficiary = (await StakeHoldersPoolCont.deployed()).address;

    // deploy OceanSix721
    await deployer.deploy(
        oceanSixCont,
        c.oceansix.name,
        c.oceansix.symbol,
        c.oceansix.baseTokenURI,
        c.oceansix.notRevealedURI,
        c.oceansix.merkleRoot,
        c.oceansix.mBeneficiary
    );

    const token = await oceanSixCont.deployed();

    if(token) {
        console.log(
            `Deployed: OceanSix721 \n netowrk ${network} \n address ${token.address} \n owner: ${c.token.admin} \n`
        );
        setFrontEndEnv(network, token.address);
    }else{
        console.log("OceanSix21 Deployment UNSUCCESSFUL");
    }
};
