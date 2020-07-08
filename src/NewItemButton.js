import React from "react";
import Button from "react-bootstrap/Button";

import "./css/NewItemButton.scss";

export default ({ onClick, className, t }) => (
    <Button variant="primary" {...{ onClick }}>
        <span className={`NewItemButton ${className}`} title={t("buttonTooltip")}>{t("button")}</span>
    </Button>
);
