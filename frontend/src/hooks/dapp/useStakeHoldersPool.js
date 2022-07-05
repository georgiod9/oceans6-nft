import { useContractCall, useContractFunction } from "@usedapp/core";
import { Contract } from "ethers";
import {utils} from "ethers";
import  StakeHoldersPool  from "../../abi/StakeHoldersPool.json";
import config from "../../config";

const STAKEHOLDERSPOOLADDRESS = config.ContractsConfig[4].STAKEHOLDERSPOOL
const StakeHoldersPoolContractInterface = new utils.Interface(StakeHoldersPool.abi);

const StakeHoldersPoolContract = new Contract(STAKEHOLDERSPOOLADDRESS, StakeHoldersPoolContractInterface);

export const useStakeHoldersPoolMethod = () => {
    const { state, send, events } = useContractFunction(
        StakeHoldersPoolContract,
        'release(address)',
        {}
    );
    return { state, send, events };
};

export const GetShares = (account) => {
    const shares = useContractCall({
        address: STAKEHOLDERSPOOLADDRESS,
        abi: StakeHoldersPoolContractInterface,
        method: "shares",
        args:[account],
    });
    return shares ? Number(shares) : null;
};

export const GetDuePayment = (account) => {
    const balance = useContractCall({
        address: STAKEHOLDERSPOOLADDRESS,
        abi: StakeHoldersPoolContractInterface,
        method: "getDuePayment",
        args: [account]
    });
    return balance? Number(balance):0;
}

export default {useStakeHoldersPoolMethod, GetShares, GetDuePayment};