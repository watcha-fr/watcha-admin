import React from "react";
import Button from "react-bootstrap/Button";
import ExpandLogo from "../images/expand-button.svg"
import {useTranslation} from "react-i18next"

const ns = "common"

export default ({ onClick }) => {
    const { t } = useTranslation(ns);

    return (
        <Button className="expandButton" {...{ onClick }}>
            <img src={ExpandLogo} alt={t("expand")}></img>
        </Button>
    );
};
