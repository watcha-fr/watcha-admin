import React from "react";
import { useTranslation } from "react-i18next";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

export default ({ variant, message, onClick }) => {
    const { t } = useTranslation();
    return (
        <Alert className="flex-fill" variant={variant}>
            <Alert.Heading>{t(variant)}</Alert.Heading>
            <p>{message}</p>
            <hr />
            <div className="d-flex justify-content-end">
                <Button {...{ variant, onClick }}>{t("ok")}</Button>
            </div>
        </Alert>
    );
};
