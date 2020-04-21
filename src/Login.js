import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Spinner from "react-bootstrap/Spinner";

import MatrixClientContext from "./MatrixClientContext";

import logo from "./images/logo.svg";

class Login extends Component {
    constructor() {
        super();
        this.state = {
            user: "",
            password: "",
            submitCount: 0,
        };
    }

    static propTypes = {
        setupClient: PropTypes.func.isRequired,
    };

    static contextType = MatrixClientContext;

    login() {
        const client = this.context;
        const { setupClient } = this.props;
        const { user, password } = this.state;
        client
            .loginWithPassword(user, password)
            .then(() => setupClient(client))
            .catch(error => {
                this.setState({ submitCount: 0 });
                alert(error.message);
            });
    }

    onChange = event =>
        this.setState({ [event.target.name]: event.target.value });

    onLanguageChange = event =>
        this.props.i18n.changeLanguage(event.target.value);

    onSubmit = event => {
        event.preventDefault();
        this.setState(
            state => ({
                submitCount: state.submitCount + 1,
            }),
            () => {
                if (this.state.submitCount === 1) {
                    this.login();
                }
            }
        );
    };

    render() {
        const { t, i18n } = this.props;
        const button =
            this.state.submitCount === 0 ? (
                <Button variant="outline-primary" type="submit" block>
                    {t("login.button")}
                </Button>
            ) : (
                <Button
                    className="loadingLoginButton"
                    variant="outline-primary"
                    block
                    disabled
                >
                    <span className="loadingLoginText">
                        {t("login.loading")}
                    </span>
                    <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />
                </Button>
            );

        return (
            <div className="loginForm container mx-auto">
                <Form.Control
                    className="my-4"
                    as="select"
                    custom
                    value={i18n.language}
                    onChange={this.onLanguageChange}
                >
                    {["en", "fr"].map(lng => (
                        <option key={lng} value={lng}>
                            {t(`language.${lng}`)}
                        </option>
                    ))}
                </Form.Control>
                <img alt="logo" className="logo mx-auto mb-4" src={logo} />
                <div className="text-center mb-4">
                    {t("login.title")}
                </div>
                <Form onSubmit={this.onSubmit}>
                    <Form.Group>
                        <InputGroup className="flex-nowrap">
                            <InputGroup.Prepend>
                                <InputGroup.Text>
                                    <i className="fas fa-user fa-fw"></i>
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control
                                autoComplete="username"
                                name="user"
                                onChange={this.onChange}
                                placeholder={t("login.username")}
                                required
                                type="text"
                                value={this.state.userName}
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group>
                        <InputGroup className="flex-nowrap">
                            <InputGroup.Prepend>
                                <InputGroup.Text>
                                    <i className="fas fa-key fa-fw"></i>
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control
                                autoComplete="current-password"
                                name="password"
                                onChange={this.onChange}
                                placeholder={t("login.password")}
                                required
                                type="password"
                                value={this.state.password}
                            />
                        </InputGroup>
                    </Form.Group>
                    {button}
                </Form>
            </div>
        );
    }
}

export default withTranslation()(Login);
