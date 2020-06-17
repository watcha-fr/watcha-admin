import React from "react";
import Button from "react-bootstrap/Button";

import "./css/NewItemButton.scss"

export default ({ onClick, t }) => {
    return (
        <Button variant="primary" {...{ onClick }}>
            <span className="newUserButton">{t("button")}</span>
        </Button>
    );
};
