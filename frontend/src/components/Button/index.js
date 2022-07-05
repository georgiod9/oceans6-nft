import React from "react";
import Button from "react-bootstrap/Button";
// import { useHistory } from "react-router-dom";

import "./styles.scss";

function METAButton(props) {
  const { slim, buttonStyle, url, ...rest } = props;
  // const history = useHistory();

  return (
    <Button
      className="connect-btn"
      onClick={() => {
        // history.push(url);
        console.log("Push history : ", url);
      }}
      {...rest}
      style={{
        backgroundColor: "#ffffff",
        backgroundImage:
          "linear-gradient(225deg, #A265c7, #6c25be 59%, #A265c7 94%)",
        color: "#fff",
        borderColor: "transparent",
        fontFamily: "mbf-canno",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 17,
        paddingBlock: 6,
        borderRadius: 8,
        fontWeight: 400,
        width: 170,
        height: 50,
        overflow: "hidden",
        transition: "transform 200ms ease",
        boxShadow: "none",

        ...buttonStyle,
      }}
    >
      {props.text}
      {props.icon && (
        <img src={props.icon} alt={props.text} style={{ marginLeft: 15 }} />
      )}
    </Button>
  );
}
export default METAButton;
