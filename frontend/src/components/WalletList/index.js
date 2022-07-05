import React from "react";
import { isMobile } from "react-device-detect";
import detectEthereumProvider from "@metamask/detect-provider";
import WalletListing from "./WalletListing";
import Coinbase from "../../assets/images/wallets/coinbase.svg";
import Metamask from "../../assets/images/wallets/metamask-icon.svg";
import Walletconnect from "../../assets/images/wallets/walletconnect.svg";
import config from "../../config";
import styles from "./WalletList.module.scss";

const WalletList = ({activate, activateBrowserWallet}) => {

    const [openMetamaskAllow, setOpenMetamaskAllow] = React.useState(false);

    React.useEffect(() => {
        detectEthereumProvider().then((provider) => setOpenMetamaskAllow(provider ? true : false))
    }, []);

    const injectedHandle = () => {
        if(openMetamaskAllow){
            activateBrowserWallet()
        } else {
            if (isMobile) {
                window.open("https://metamask.app.link/dapp/nomadmedia.club", "_blank");
            } else {
                alert("You should install MetaMask browser extension");
            }
        }
    }
    return (
        <div className={styles["walletListWrapper"]}>
            <WalletListing heading="Metamask" iconSrc={Metamask} onWalletCall={injectedHandle} />
            <WalletListing heading="Coinbase" iconSrc={Coinbase} onWalletCall={() => activate(config.Connectors.coinbase)} />
            <WalletListing heading="WalletConnect" iconSrc={Walletconnect} onWalletCall={() => activate(config.Connectors.walletconnect)} />
        </div>
    );
};

export default WalletList;
