import React from "react";
import { withTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";

export default withTranslation()(({ onClick, t }) => (
    <Button variant="primary" {...{ onClick }}>
        <span className="newUserButton">{t("usersTab.button")}</span>
    </Button>
));
