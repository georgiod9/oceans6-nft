import DappConfig from "./dapp";
import ContractsConfig from "./contractsAddresses";
import Connectors from "./connectors";

const stage = process.env.REACT_APP_ENV;

const config = {
    DappConfig: { ...DappConfig },
    ContractsConfig: { ...ContractsConfig },
    Connectors: { ...Connectors },
    Ethscan: (stage !== 'production'  ? 'rinkeby.' : '') + 'etherscan.io/tx/',
    Infura:
        (stage !== "production" ? "rinkeby." : "mainnet.") +
        "infura.io/v3/" +
        process.env.REACT_APP_INFURA_KEY
};
export default config;

