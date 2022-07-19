import React from "react";
import { useEthers, useGasPrice } from "@usedapp/core";
import {Button} from "react-bootstrap";
import {AiOutlineArrowRight} from "react-icons/ai";
import {TotalSupply} from "../../hooks/dapp/useOceanSix721"
import { useStakeHoldersPoolMethod } from "../../hooks/dapp/useStakeHoldersPool";
import "./styles.scss"

import connectWalletButton from '../../assets/images/layers/button.png';

const ConnectButtonWallet = ({showModalSection, callMint, amount, setIsWalletList, dueNFTPayment}) => {
  const supply = TotalSupply();

  const {
      deactivate,
      account
  } = useEthers();

  const {send} = useStakeHoldersPoolMethod();
  const gas = useGasPrice();

  const handleConnectWallet = () => account ? deactivate() : setIsWalletList(true);

  return account ? (
    dueNFTPayment ? (
        <>
          <Button
              variant="light"
              className="connectWalletBtn"
              prefixicon="Wallet"
              padding="5px 5px"
              onClick={() => {
                send(account, {
                  gasPrice: gas,
                  gasLimit: 200000,
                });
              }}
          >
              Collect Payement <AiOutlineArrowRight />
          </Button>
        </>
    ) : (
      !isNaN(supply)?(
        supply < 22222 ? (
          <>
            <Button
                variant="light"
                className="connectWalletBtn"
                prefixicon="Wallet"
                padding="5px 5px"
                onClick={() =>{
                  showModalSection();
                  callMint(amount)
                }}
            >
                Mint <AiOutlineArrowRight />
            </Button>
          </>
        ) : (
            <Button
                variant="light"
                disabled={true}
                className="connectWalletBtn"
                prefixicon="Wallet"
                padding="5px 5px"
            >
                Sold Out ! <AiOutlineArrowRight />
            </Button>
        )
      ) : null
    )
  ) : (
    <div >
      
      <div
        className="connectWalletBtnBg"
        onClick={handleConnectWallet}
      >
        <img src={connectWalletButton} className="connectWalletButtonSizing"></img>
      </div>
    </div>
  );
};

export default ConnectButtonWallet;
