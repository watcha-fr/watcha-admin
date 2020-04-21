import React from "react";
import { withTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";

function CreateUserButton({ variant, onClick, t }) {
    return <Button {...{ variant, onClick }}>{t("Create user")}</Button>;
}

export default withTranslation()(CreateUserButton);
