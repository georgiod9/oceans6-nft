import React from "react";

import { Modal } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import METAButton from "../Button";

import "./styles.scss";

const ModalTemplate = ({
  heading,
  children,
  show,
  setShow,
  hideFooter,
  hideHeader,
  size = "lg",
}) => {
  return (
    <div>
      <Modal
        size={size}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={() => setShow(false)}
      >
        {!hideHeader && (
          <Modal.Header className="modalTemplateWrapper">
            <div className="modalTemplateHeading">
              <div className="modalTemplateHeadingBox" />
              <div className="modalTemplateHeadingText">
                <h4 className="modalTemplateHeadingText">{heading}</h4>
              </div>
              <AiOutlineClose
                color="white"
                className="modalTemplateHeadingClose"
                onClick={() => setShow(false)}
              />
            </div>
          </Modal.Header>
        )}
        <Modal.Body className="modalTemplateWrapper">{children}</Modal.Body>
        {!hideFooter && (
          <Modal.Footer className="modalTemplateWrapper">
            <METAButton onClick={() => setShow(false)} text="Close"></METAButton>
          </Modal.Footer>
        )}
      </Modal>
    </div>
  );
};

export default ModalTemplate;
