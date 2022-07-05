import "./styles.scss"
import {Button, Col, Container, Row} from "react-bootstrap";
import React from "react";
import {FaTwitter, FaDiscord, FaTelegram} from "react-icons/fa";

const Footer = () => {
    return (
        <div className="footerPositioning">
            <Container>
                <Row>
                    <Col xs={{span:12, order:1}} lg={{span:4, order:1}} className="brandFooterPositioning">
                    </Col>
                    <Col xs={{span:12, order:2}} lg={{span:4, order:2}}>
                        <br/>
                        <Row >
                            <Col className="d-flex justify-content-center">
                                <Button variant="secondary" size="lg" className="nomadNavBarButtonDiscord"><FaTwitter /></Button>{' '}
                                <Button variant="secondary" size="lg" className="nomadNavBarButtonDiscord"><FaDiscord /></Button>{' '}
                                <Button variant="secondary" size="lg" className="nomadNavBarButtonDiscord"><FaTelegram /></Button>{' '}
                            </Col>
                        </Row>
                        <br/>
                        <br/>
                        <Row>
                            <Col className="d-flex justify-content-center">
                                <p className="stylingTandC">
                                    Privacy Policy &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Terms & Conditions
                                </p>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={{span:12, order:3}} lg={{span:4, order:3}}>

                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Footer;