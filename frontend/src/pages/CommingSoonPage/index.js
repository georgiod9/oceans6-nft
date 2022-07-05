import {Col, Container, Row} from "react-bootstrap";
import "./styles.scss";
import React from "react";
import Footer from "../../components/Footer";
import ComingSoon from "../../components/ComingSoon";

const CommingSoonPage = () => {
    return (
        <div>
            <Container>
                <Row>
                    <Col xs={{span: 12, order:1}} lg={{span:12, order:1}} className="nftComingSoonCol">
                        <ComingSoon />
                    </Col>
                </Row>
                <Row >
                    <Col className="ComingSoonFont">
                        <p>Coming Soon</p>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
};

export default CommingSoonPage;
