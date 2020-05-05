import React from "react";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";

export default ({ ns, onClick }) => {
    const { t } = useTranslation(ns);
    return (
        <Button variant="primary" {...{ onClick }}>
            <span className="newUserButton">{t("button")}</span>
        </Button>
    );
};
