import React from "react";
import Button from "react-bootstrap/Button";

import "./css/NewItemButton.scss";

export default ({ onClick, className, t }) => (
    <Button variant="primary" {...{ onClick }} title={t("buttonTooltip")}>
        <span className={`NewItemButton ${className}`}>{t("button")}</span>
    </Button>
);
