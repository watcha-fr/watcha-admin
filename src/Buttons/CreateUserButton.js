import React from "react";
import { withTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";

export default withTranslation()(({ variant, onClick, t }) => (
    <Button {...{ variant, onClick }}>{t("Create user")}</Button>
));
