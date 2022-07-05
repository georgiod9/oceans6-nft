import { getChainById, ChainId } from '@usedapp/core';

const stage = process.env.REACT_APP_PUBLIC_ENV;

const DappConfig = {
    readOnlyChainId: stage === 'development' || stage === 'staging' ? ChainId.Rinkeby : ChainId.Mainnet,
    readOnlyUrls: {
        [ChainId.Mainnet]: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`,
        [ChainId.Rinkeby]: `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`
    },
    pollingInterval: 1000,
    networks: [getChainById(ChainId.Rinkeby), getChainById(ChainId.Mainnet)],
    notifications: {
        checkInterval: 100,
        expirationPeriod: 10000,
    },
    autoConnect: false,
}

export default DappConfig;