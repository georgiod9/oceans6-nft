<Container className="containerButtons">
                            {!dueNFTPayment ?
                                <><Row>
                                    <div className="price_container">
                                        <div className="price_bar">
                                            <img src={priceBar} className="priceBarSizing"></img>

                                        </div>
                                        <div className="price_box">
                                            <Button variant="secondary" size="sm" className="oceanSixMintingPagePriceButton">Price <br /> {Number(mintPrice) / Math.pow(10, 18)} eth</Button>

                                        </div>

                                        <div className="mints_per_wallet">
                                            <Button variant="secondary" size="m" className="oceanSixMintingPageTitleButton">Mints per Wallet <br /> {phase == '0' ? (account ? Number(mintPerUser) + '/' + mintingLimit : mintingLimit + '/' + mintingLimit) : '∞'} </Button>
                                        </div>


                                    </div>
                                    <Col className="d-flex justify-content-end columnPositioning1">
                                        <Button variant="secondary" size="sm" className="oceanSixMintingPagePriceButton">Price <br /> {Number(mintPrice) / Math.pow(10, 18)} eth</Button>
                                    </Col>
                                    <Col className="columnPositioning2">
                                        <Button variant="secondary" size="m" className="oceanSixMintingPageAvailableButton">Available <br /> {Number(supply)}/22</Button>
                                    </Col>
                                </Row>
                                    <Row>
                                        <Col className="d-flex justify-content-end columnPositioning1">
                                            <Button variant="secondary" size="m" className="oceanSixMintingPageTitleButton">Mints per Wallet <br /> {phase == '0' ? (account ? Number(mintPerUser) + '/' + mintingLimit : mintingLimit + '/' + mintingLimit) : '∞'} </Button>
                                        </Col>
                                        <Col className="columnPositioning2">
                                            <Button variant="secondary" size="m" className="oceanSixMintingPageTitle2Button">
                                                <div className="mint-count">
                                                    <div className="arrow-left">
                                                        <FaChevronLeft
                                                            size="10x"
                                                            onClick={() => {
                                                                setAmount(amount === 1 ? Number(mintingLimit) : amount - 1);
                                                            }} />
                                                    </div>

                                                    <div className="amount">{amount}</div>
                                                    <div className="arrow-right">
                                                        <FaChevronRight
                                                            size="10x"
                                                            onClick={() => {
                                                                setAmount(amount === Number(mintingLimit) ? 1 : amount + 1);
                                                            }} />
                                                    </div>
                                                </div>
                                            </Button>
                                        </Col>
                                    </Row></> :
                                <Row>
                                    <Col>
                                        <Button variant="secondary" size="sm" className="oceanSixDuePaymentButton">Due Payement <br /> {Number(duePayment) / Math.pow(10, 18)} ETH</Button>
                                    </Col>
                                </Row>
                            }
                        </Container>