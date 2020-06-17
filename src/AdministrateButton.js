import React from "react";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";

const ns = "dashboardTab";

export default ({ panelName, onClick }) => {
    const { t } = useTranslation(ns);

    return (
        <Button className="administrateButton" {...{onClick}}>
            {t(`${panelName}.administrateButton`)}
        </Button>
    );
};
