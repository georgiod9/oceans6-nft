import React from "react";
import styles from "./WalletListing.module.scss";
import Image from 'next/image'

const WalletListing = ({ iconSrc, heading, onWalletCall, isWhite = false, noBottomBorder = false }) => {

    return (
        <div style={noBottomBorder ? {borderBottom: '0'} : {}} className={styles["walletListingWrapper"]}
             onClick={onWalletCall}>

            {isWhite && (
                <>
                    <div className={styles["walletIconBackground"]}>
                        <Image width={22} src={iconSrc} alt={heading} className={styles["walletListingIcon"]}/>
                    </div>
                </>
            )}

            {!isWhite && (
                <>
                    <Image height={22} width={22} src={iconSrc} alt={heading} className={styles["walletListingIcon"]}/>
                </>
            )}

            <h6 className={styles["walletListingName"]}>{heading}</h6>
        </div>
    );
}

export default WalletListing;