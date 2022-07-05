import React from "react";
import WalletList from "../WalletList";
import styles from "./WalletSidebar.module.scss";

function WalletSidebar({ isOpen, onClose, activate, activateBrowserWallet }) {
    const handleClose = () => typeof onClose === "function" && onClose();

    return (
        <>
            <div
                className={styles["walletContent"]}
                style={{
                    width: 270,
                    backgroundColor: "#fff",
                    transition: "0.5s",
                    zIndex: 10001,
                    position: "fixed",
                    right: !isOpen ? -270 : 0,
                    marginTop: 40,
                    height: "auto",
                    borderTopLeftRadius: "5px",
                    borderBottomLeftRadius: "5px",
                }}
            >
                <div style={{ marginLeft: 10, marginRight: 10 }}></div>
                <div style={{ paddingTop: 20 }}>
                    <div>
                        <div className={styles["menuDivision"]} onClick={() => handleClose()}>
                            <p>Connect with one of the available wallet providers.</p>
                            <WalletList
                                activate={activate}
                                activateBrowserWallet={activateBrowserWallet}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        background: "transparent",
                        zIndex: 10000,
                        position: "fixed",
                        left: 0,
                    }}
                    onClick={() => handleClose()}
                />
            )}
        </>
    );
}

export default WalletSidebar;
