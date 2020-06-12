import React, { Component } from "react";
import Container from "react-bootstrap/Container";

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    render() {
        const email = "contact@watcha.fr";
        const redirectUrl = window.location.host;
        return this.state.hasError ? (
            <Container className="fullCentered">
                <h1 className="mb-5">Something went wrong!</h1>
                <p>
                    {"You can try to refresh the page, or follow this link "}
                    <a href={"/"}>{redirectUrl}</a>
                    {" to return to Watcha."}
                </p>
                <p>
                    {"Should the failure happen again, please contact us at "}
                    <a href={"mailto:" + email}>{email}</a>.
                </p>
            </Container>
        ) : (
            this.props.children
        );
    }
}
