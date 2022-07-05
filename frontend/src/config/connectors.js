import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";

import DappConfig from "./dapp.js";

const POLLING_INTERVAL = DappConfig.pollingInterval;
const RPC_URLS = DappConfig.readOnlyUrls[DappConfig.readOnlyChainId];

const walletconnect = new WalletConnectConnector({
    rpc: { [DappConfig.readOnlyChainId]: RPC_URLS },
    bridge: "https://bridge.walletconnect.org",
    infuraId: process.env.NEXT_PUBLIC_INFURA_KEY,
    qrcode: true,
    pollingInterval: POLLING_INTERVAL,
    supportedChainIds: [DappConfig.readOnlyChainId],
    chainId: DappConfig.readOnlyChainId,
});

const coinbase = new WalletLinkConnector({
    url: RPC_URLS,
    appName: "Ocean 6",
    appLogoUrl: "/coinbase.png",
    supportedChainIds: [DappConfig.readOnlyChainId],
    darkMode: true,
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    walletconnect,
    coinbase
};
