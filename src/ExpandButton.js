import React from "react";
import Button from "react-bootstrap/Button";
import ExpandLogo from "./images/expand-button.svg";
import { useTranslation } from "react-i18next";

import "./css/ExpandButton.scss";

const ns = "common";

export default ({ onClick }) => {
    const { t } = useTranslation(ns);

    return (
        <Button className="ExpandButton" {...{ onClick }}>
            <img src={ExpandLogo} alt={t("expand")}></img>
        </Button>
    );
};
