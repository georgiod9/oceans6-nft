import React from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import Brand from "../../assets/images/PNG-OCEANS-1.png";
import { FaTwitter, FaDiscord, FaEthereum } from 'react-icons/fa';
import { BiWallet } from "react-icons/bi";
import "./styles.scss";
import { useEthers } from "@usedapp/core";
import WalletSidebar from "../WalletSidebar";
import { GetShares } from "../../hooks/dapp/useStakeHoldersPool";


const NavBar = ({ isWalletList, setIsWalletList, dueNFTPayment, setDueNFTPayment }) => {
    const {
        deactivate,
        account,
        activateBrowserWallet,
        activate,
    } = useEthers();

    const shares = GetShares(account);

    const handleConnectWallet = () => {
        account ? deactivate() : setIsWalletList(true);
    };

    const handleDuePayment = () => {
        shares > 0 ? setDueNFTPayment(!dueNFTPayment) : setDueNFTPayment(dueNFTPayment);
    }

    return (
        <>

            <Navbar collapseOnSelect bg="light" variant="light" expand="lg" className="ocean6NavBar navbar-h" >

                <Container fluid >

                    <Navbar.Brand href="/" >
                        <img src={Brand} alt="Logo" className="brandPositioning" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto itemsPositioning">
                            <Nav.Item className="itemColor">
                                <Nav.Link className="itemColor">roadmap</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link className="itemColor">team</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link className="itemColor">gallery</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link className="itemColor">contact us</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Nav className="navbar-right">
                            <Button variant="light" className="oceanSixNavBarButtonTwitter"><FaTwitter /></Button>{' '}
                            <Button variant="light" className="oceanSixNavBarButtonTwitter"><FaDiscord /></Button>{' '}
                            {account && shares > 0
                                ? (<Button variant="secondary" className="oceanSixNavBarButtonTwitter"
                                    onClick={handleDuePayment}><FaEthereum /></Button>
                                ) : null
                            }
                            {account
                                ? (<Button variant="light" className="oceanSixNavBarButtonWallet"
                                    onClick={handleConnectWallet}>Disconnect</Button>
                                ) : (<><Button variant="light" className="oceanSixNavBarButtonWallet"
                                    onClick={handleConnectWallet}><BiWallet /></Button>
                                    <WalletSidebar
                                        isOpen={isWalletList}
                                        onClose={() => setIsWalletList(false)}
                                        activate={activate}
                                        activateBrowserWallet={activateBrowserWallet}
                                    /></>
                                )
                            }
                        </Nav>
                    </Navbar.Collapse>

                </Container>

            </Navbar>
            {/* <div className="horizLine"></div> */}
        </>

    );
};

export default NavBar;