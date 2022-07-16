import { Button, Col, Container, Row } from "react-bootstrap";
import NFTPoster from "../../components/NFTPoster";
import Bubble from "../../components/Bubble";

import "./styles.scss";
import React, { useState } from "react";
import Footer from "../../components/Footer";
import ConnectButtonWallet from "../../components/ConnectWalletButton";
import { useEthers, useGasPrice } from "@usedapp/core";
import { GetMintPerUser, GetMintPrice, GetPhase, GetMintingLimit, TotalSupply, useOceanSix721Method } from "../../hooks/dapp/useOceanSix721";
import {
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";


import MintingModal from "../../components/MintingModal";
import keccak256 from "keccak256";
import { utils as eUtils } from "ethers/lib/ethers";
import useMerkleTree from "../../hooks/useMerkleTree";
import { GetDuePayment, GetShares } from "../../hooks/dapp/useStakeHoldersPool";

import hologramRect from '../../assets/images/layers/holo-rect.png';
import hologramPad from '../../assets/images/layers/holo-pad.png';
import hologramBorder from '../../assets/images/layers/hologram-border.png';
import priceBar from '../../assets/images/layers/mint_price_resize.png';

const MintingPage = ({ isWalletList, setIsWalletList, dueNFTPayment }) => {
    const {
        account,
    } = useEthers();

    const supply = TotalSupply();
    const phase = GetPhase();
    const mintPerUser = GetMintPerUser(phase, account);
    const gas = useGasPrice();
    const mintPrice = GetMintPrice(phase);

    const tree = useMerkleTree();
    const { state, send } = useOceanSix721Method("mint");
    const [amount, setAmount] = React.useState(1);
    const mintingLimit = GetMintingLimit();

    const shares = GetShares(account);
    const duePayment = GetDuePayment(account);

    const [showModal, setShowModal] = useState(false);

    const callMint = (amount) =>
        send(account, amount, tree.getHexProof(keccak256(account)), {
            gasPrice: gas,
            gasLimit: parseInt(200000 * (amount < 5 ? amount : amount / 2.5)),
            value: eUtils.parseEther(
                parseFloat(
                    (
                        parseFloat(Number(mintPrice) / 1e18).toPrecision(3) * amount
                    ).toString()
                ).toPrecision(3)
            ),
        });

    return (
        <div className="main-container  ">
            {/*<Bubble className="absolute "/>*/}
            <div className="container_mint">
                <img src={hologramRect} className="hologram-rect"></img>
                <img src={hologramPad} className="hologram-pad"></img>
                <div className="hologram-border">
                    <img src={hologramBorder} className="border-image-sizing"></img>
                </div>

                <div className="vflex-box justify-center alignItems-center alignContent-center">

                    <div className="nft-poster"><NFTPoster /></div>
                    <div className="mint-panel">
                        <p className="mintingPageParagraphStyle">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>

                        <Container className="containerButtons">
                            {!dueNFTPayment ?
                                <><Row>
                                    <div className="price_container">
                                        <div className="price_bar">
                                            <img src={priceBar} className="priceBarSizing"></img>

                                        </div>

                                        <div className="mints_per_wallet">
                                            <Button variant="secondary" size="m" className="oceanSixMintingPageTitleButton">Mints per Wallet <br /> {phase == '0' ? (account ? Number(mintPerUser) + '/' + mintingLimit : mintingLimit + '/' + mintingLimit) : '∞'} </Button>
                                        </div>

                                        <div className="price_box">
                                            <Button variant="secondary" size="sm" className="oceanSixMintingPagePriceButton">Price <br /> {Number(mintPrice) / Math.pow(10, 18)} eth</Button>

                                        </div>




                                    </div>


                                </Row>
                                    <Row>


                                    </Row></> :
                                <Row>
                                    <Col>
                                        <Button variant="secondary" size="sm" className="oceanSixDuePaymentButton">Due Payement <br /> {Number(duePayment) / Math.pow(10, 18)} ETH</Button>
                                    </Col>
                                </Row>
                            }
                        </Container>
                    </div>
                </div>


            </div>

            <Footer />


        </div>
    );
};

export default MintingPage;
