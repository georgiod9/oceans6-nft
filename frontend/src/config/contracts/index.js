import { utils } from "ethers";
import { Contract } from "@ethersproject/contracts";

import config from "../index.js";

import * as abi from "../../abi";

const OceanSix721Addr = config.ContractsConfig[4].OCEANSIX721;
const OceanSix721Interface = new utils.Interface(abi.OceanSix721.abi);
const OceanSix721Contract = new Contract(
    OceanSix721Addr,
    OceanSix721Interface
);

const StakeHoldersPoolAddr = config.ContractsConfig[4].STAKEHOLDERSPOOL;
const StakeHoldersPoolInterface = new utils.Interface(abi.StakeHolderPool.abi);

const StakeHoldersPoolContract = new Contract(
    StakeHoldersPoolAddr,
    StakeHoldersPoolInterface
);

const erc721Interface = new utils.Interface(abi.ERC721.abi);

export {
    OceanSix721Addr,
    OceanSix721Interface,
    OceanSix721Contract,
    StakeHoldersPoolAddr,
    StakeHoldersPoolInterface,
    StakeHoldersPoolContract,
    erc721Interface,
};
