import React from "react";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";

import expandLogo from "./images/expand-button.svg";

import "./css/ExpandButton.scss";

export default ({ onClick }) => {
    const { t } = useTranslation();

    return (
        <Button className="ExpandButton" {...{ onClick }}>
            <img src={expandLogo} alt={t("expand")}></img>
        </Button>
    );
};
