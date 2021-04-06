import React, { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKey } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Spinner from "react-bootstrap/Spinner";

import { useMatrixClientContext } from "./contexts";

import logo from "./images/logo.svg";
import "./css/Login.scss";

const Login = ({ setupClient }) => {
    const { t, i18n } = useTranslation();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [pendingLogin, setPendingLogin] = useState(false);

    const client = useMatrixClientContext();

    const onLanguageChange = event => i18n.changeLanguage(event.target.value);

    const onUsernameChange = event => setUsername(event.target.value);

    const onPasswordChange = event => setPassword(event.target.value);

    const onSubmit = event => {
        event.preventDefault();
        setPendingLogin(prevPendingLogin => {
            prevPendingLogin || login();
            return true;
        });
    };

    const login = () =>
        client
            .loginWithPassword(username, password)
            .then(() => setupClient(client))
            .catch(error => {
                setPendingLogin(false);
                alert(error.message);
            });

    const button = pendingLogin ? (
        <Button className="loadingLoginButton" variant="outline-primary" block disabled>
            <span className="flex-grow-1">{t("login.loading")}</span>
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
        </Button>
    ) : (
        <Button variant="outline-primary" type="submit" block>
            {t("login.button")}
        </Button>
    );

    return (
        <Container className="loginForm">
            <Form.Control className="my-4" as="select" custom value={i18n.language} onChange={onLanguageChange}>
                {["en", "fr"].map(lng => (
                    <option key={lng} value={lng}>
                        {t(`language.${lng}`)}
                    </option>
                ))}
            </Form.Control>
            <img alt="logo" className="logo mx-auto mb-4" src={logo} />
            <div className="text-center mb-4">{t("login.title")}</div>
            <Form {...{ onSubmit }}>
                <Form.Group>
                    <InputGroup className="flex-nowrap">
                        <InputGroup.Prepend>
                            <InputGroup.Text>
                                <FontAwesomeIcon icon={faUser} fixedWidth />
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                            autoComplete="username"
                            name="username"
                            onChange={onUsernameChange}
                            placeholder={t("login.username")}
                            required
                            type="text"
                            value={username}
                        />
                    </InputGroup>
                </Form.Group>
                <Form.Group>
                    <InputGroup className="flex-nowrap">
                        <InputGroup.Prepend>
                            <InputGroup.Text>
                                <FontAwesomeIcon icon={faKey} fixedWidth />
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                            autoComplete="current-password"
                            name="password"
                            onChange={onPasswordChange}
                            placeholder={t("login.password")}
                            required
                            type="password"
                            value={password}
                        />
                    </InputGroup>
                </Form.Group>
                {button}
            </Form>
        </Container>
    );
};

Login.propTypes = {
    setupClient: PropTypes.func.isRequired,
};

export default Login;
