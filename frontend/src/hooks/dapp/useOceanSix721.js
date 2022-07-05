import {useContractCall, useContractFunction} from "@usedapp/core";
import OceanSix721 from "../../abi/OceanSix721.json";
import {utils} from "ethers";
import config from "../../config";
import {Contract} from "@ethersproject/contracts";


const OCEANSIX721ADDRESS = config.ContractsConfig[4].OCEANSIX721
//console.log("OCEAN6721address: ", OCEANSIX721ADDRESS)
console.log("OCEAN6721address: ", config.ContractsConfig[1337])

const OceanSix721ContractInterface = new utils.Interface(OceanSix721.abi);

const OceanSixContract = new Contract(OCEANSIX721ADDRESS, OceanSix721ContractInterface);

export const useOceanSix721Method = (methodName) => {
    const { state, send, events } = useContractFunction(
        OceanSixContract,
        methodName,
        {}
    );
    return { state, send, events };
};

export const GetMintPrice = (phase) => {
    const mintPrice = useContractCall({
        address: OCEANSIX721ADDRESS,
        abi: OceanSix721ContractInterface,
        method: "_mintPrice",
        args: [phase],
    });
    return mintPrice;
};

export const GetMintingLimit = () => {
    const presaleLimit = useContractCall({
        address: OCEANSIX721ADDRESS,
        abi: OceanSix721ContractInterface,
        method: "getMintingLimit",
        args: [],
    });
    return presaleLimit
}

export const GetMintPerUser = (phase, address) => {
    const mintPerUser = useContractCall({
        address: OCEANSIX721ADDRESS,
        abi: OceanSix721ContractInterface,
        method: "_mintsPerUser",
        args: [phase, address]
    });
    return mintPerUser
}

export const TotalSupply = () => {
    const tot = useContractCall({
        address: OCEANSIX721ADDRESS,
        abi: OceanSix721ContractInterface,
        method: "totalSupply",
        args: [],
    });
    return Number(tot);
};


export const GetPhase = () => {
    const phase = useContractCall({
        address: OCEANSIX721ADDRESS,
        abi: OceanSix721ContractInterface,
        method: "getPhase",
        args: [],
    });
    return phase ;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {useOceanSix721Method, TotalSupply, GetPhase, GetMintPrice, GetMintingLimit};