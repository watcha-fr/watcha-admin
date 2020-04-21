import React, { Component } from "react";
import { withTranslation, Trans } from "react-i18next";
import Container from "react-bootstrap/Container";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        setTimeout(
            () => window.location.replace(window.location.origin),
            15000
        );
        return { hasError: true };
    }

    render() {
        const { t } = this.props;
        const email = "contact@watcha.fr";
        const redirectUrl = window.location.host;
        return this.state.hasError ? (
            <Container className="fullCentered">
                <h1 className="mb-5">{t("errorBoundary.title")}</h1>
                <Trans i18nKey="errorBoundary.body" t={t}>
                    <p>
                        <a href={"mailto:" + email}>{{ email }}</a>
                    </p>
                    <p>
                        <code>{{ redirectUrl }}</code>
                    </p>
                </Trans>
            </Container>
        ) : (
            this.props.children
        );
    }
}

export default withTranslation()(ErrorBoundary);
