import React from "react";
import Button from "react-bootstrap/Button";
import ExpandLogo from "../images/expand-button.svg"

export default ({ onClick }) => {
    return (
        <Button className="expandButton" {...{ onClick }}>
            <img src={ExpandLogo} alt="expandedButton"></img>
        </Button>
    );
};
