import React from "react";
import { Col, Row } from "react-bootstrap";
import Lottie from "react-lottie";
import MPRNSuccess from "../../assets/images/mprn-success.svg";
import NOMADMintingNFT from "../../assets/images/NFTExample.png";
import animationData from "../../assets/lotties/wobloader";
import ModalTemplate from "../../components/ModalTemplate";
import config from "../../config";
import "./styles.scss";

const MintingModal = ({ show, setShow, mintingState, account }) => {
  const [callOnce, setCallOnce] = React.useState(false);
  const [image, setImage] = React.useState(NOMADMintingNFT);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const modalTitle = () => {
    if (mintingState.status === "None") return "Minting";
    if (mintingState.status === "Mining") {
      if (callOnce) {
        setImage(NOMADMintingNFT);
        setCallOnce(false);
      }
      return "Minting";
    }

    if (mintingState.status === "Exception") {
      return "Rejected";
    }

    if (mintingState.status === "Fail") {
      return "Transaction Failed!";
    }

    if (mintingState.status === "Success") {
      return "Your purchase was processed!";
    }

    return "Minting";
  };

  return (
    <div>
      <ModalTemplate
        heading={modalTitle()}
        show={show}
        setShow={setShow}
        hideFooter
      >
        <div className="purchaseModalWrapper">
          {mintingState.status === "None" && (
            <>
              <div></div>
              <Lottie options={defaultOptions} height={100} width={100} />
              <div className="purchaseModalShare">
                <h5>Your NFT is being minted...</h5>
              </div>
            </>
          )}
          {mintingState.status === "Exception" && (
            <>
              <div></div>
              <div className="purchaseModalShare">
                <h5>{mintingState.errorMessage}</h5>
              </div>
              <div className="purchaseModalShare">
                <h5>Open your wallet and accept the transaction</h5>
              </div>
            </>
          )}

          {mintingState.status === "Fail" && (
            <>
              <p style={{ color: "white" }}>
                You can check your transaction status{" "}
                <a
                  href={`https://${config.Ethscan}${
                    mintingState.transaction.hash
                      ? mintingState.transaction.hash
                      : ""
                  }`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  here
                </a>
              </p>
              <p style={{ color: "white" }}>
                Minting was not complete. Please try again!
              </p>

              <div className="purchaseModalTable">
                <Row className="purchaseModalTableUpperRow">
                  <Col xs={4} className="purchaseModalTableCol">
                    <p className="purchaseModalTableColHeaderText">Status</p>
                  </Col>
                  <Col xs={8} className="purchaseModalTableCol">
                    <p className="purchaseModalTableColHeaderText">
                      Transaction Hash
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col xs={4} className="purchaseModalTableCol">
                    <p>Failed</p>
                  </Col>

                  <Col xs={8} className="purchaseModalTableCol">
                    <p className="purchaseModalTransactionHash">
                      <a
                        href={`https://${config.Ethscan}${
                          mintingState.transaction.hash
                            ? mintingState.transaction.hash
                            : ""
                        }`}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {mintingState.transaction.hash
                          ? mintingState.transaction.hash.substring(0, 15)
                          : ""}
                      </a>
                    </p>
                  </Col>
                </Row>
              </div>
            </>
          )}

          {mintingState.status === "Mining" && (
            <>
              <div></div>
              <Lottie options={defaultOptions} height={100} width={100} />

              <div className="purchaseModalTable">
                <Row className="purchaseModalTableUpperRow">
                  <Col xs={4} className="purchaseModalTableCol">
                    <p className="purchaseModalTableColHeaderText">Status</p>
                  </Col>
                  <Col xs={8} className="purchaseModalTableCol">
                    <p className="purchaseModalTableColHeaderText">
                      Transaction Hash
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col xs={4} className="purchaseModalTableCol">
                    <p>Pending</p>
                  </Col>
                  <Col xs={8} className="purchaseModalTableCol">
                    <p className="purchaseModalTransactionHash">
                      <a
                        href={`https://${config.Ethscan}${
                          mintingState.transaction.hash
                            ? mintingState.transaction.hash
                            : ""
                        }`}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {mintingState.transaction.hash
                          ? mintingState.transaction.hash.substring(0, 15)
                          : ""}
                      </a>
                    </p>
                  </Col>
                </Row>
              </div>

              <div className="purchaseModalShare">
                <h5>Your NFT is being minted...</h5>
              </div>
            </>
          )}

          {mintingState.status === "Success" && (
            <>
              <h6 className="purchaseModalHeaderStatement">
                You just minted a Nomad NFT It’s been confirmed on the
                blockchain! <br />
                The artwork will be revealed once all NFTs are minted
              </h6>
              <img
                src={image}
                alt="Purchase NFT"
                className="MintingRollingImage"
              />
              <div className="purchaseModalCollectionWrapper">
                <h6>Nomad</h6>
              </div>
              <div className="purchaseModalTable">
                <Row className="purchaseModalTableUpperRow">
                  <Col xs={4} className="purchaseModalTableCol">
                    <p className="purchaseModalTableColHeaderText">Status</p>
                  </Col>
                  <Col xs={8} className="purchaseModalTableCol">
                    <p className="purchaseModalTableColHeaderText">
                      Transaction Hash
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col xs={4} className="purchaseModalTableCol">
                    <img src={MPRNSuccess} alt="success" />
                    &nbsp;&nbsp;Complete
                  </Col>
                  <Col xs={8} className="purchaseModalTableCol">
                    <p className="purchaseModalTransactionHash">
                      <a
                        href={`https://${config.Ethscan}${
                          mintingState.transaction.hash
                            ? mintingState.transaction.hash
                            : ""
                        }`}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {mintingState.transaction.hash
                          ? mintingState.transaction.hash.substring(0, 15)
                          : ""}
                      </a>
                    </p>
                  </Col>
                </Row>
              </div>
            </>
          )}
        </div>
      </ModalTemplate>
    </div>
  );
};

export default MintingModal;
