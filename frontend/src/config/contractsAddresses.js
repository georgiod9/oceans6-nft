import { ChainId } from '@usedapp/core';

const ContractsConfig = {
    [ChainId.Rinkeby]: {
        OCEANSIX721: process.env.REACT_APP_OCEANSIX721_ADDRESS_RINKEBY,
        STAKEHOLDERSPOOL: process.env.REACT_APP_STAKEHOLDERSPOOL_ADDRESS_RINKEBY
    },
    [ChainId.Mainnet]: {
        OCEANSIX721: process.env.REACT_APP_OCEANSIX721_ADDRESS_MAINNET,
        STAKEHOLDERSPOOL: process.env.REACT_APP_STAKEHOLDERSPOOL_ADDRESS_MAINNET
    },
    [ChainId.Localhost]: {
        OCEANSIX721: process.env.REACT_APP_OCEANSIX721_ADDRESS_DEVELOPMENT,
        STAKEHOLDERSPOOL: process.env.REACT_APP_STAKEHOLDERSPOOL_ADDRESS_DEVELOPMENT
    },
}

export default ContractsConfig;
