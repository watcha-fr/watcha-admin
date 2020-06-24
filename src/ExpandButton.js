import React from "react";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";

import icon from "./images/expand-button.svg";

import "./css/ExpandButton.scss";

export default ({ onClick }) => {
    const { t } = useTranslation("dashboardTab");

    return (
        <Button className="ExpandButton" {...{ onClick }}>
            <img src={icon} alt={t("expand")} title={t("expand")}></img>
        </Button>
    );
};
