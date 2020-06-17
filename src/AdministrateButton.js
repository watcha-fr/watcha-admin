import React from "react";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";

import "./css/AdministrateButton.scss"

const ns = "dashboardTab";

export default ({ panelName, onClick }) => {
    const { t } = useTranslation(ns);

    return (
        <Button className="AdministrateButton" {...{onClick}}>
            {t(`${panelName}.administrateButton`)}
        </Button>
    );
};
