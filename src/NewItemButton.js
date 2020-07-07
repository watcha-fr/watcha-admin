import React from "react";
import Button from "react-bootstrap/Button";

import "./css/NewItemButton.scss";

export default ({ onClick, t }) => (
    <Button variant="primary" {...{ onClick }}>
        <span className="NewItemButton">{t("button")}</span>
    </Button>
);
