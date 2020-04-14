import React, { Component } from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "react-i18next";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import logo from "./images/logo.svg";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            password: "",
        };
    }

    static propTypes = {
        connection: PropTypes.func.isRequired,
    };

    onChange = event =>
        this.setState({ [event.target.name]: event.target.value });

    onLanguageChange = event =>
        this.props.i18n.changeLanguage(event.target.value);

    onSubmit = event => {
        event.preventDefault();
        this.props.connection(this.state.userName, this.state.password);
    };

    render() {
        const { t } = this.props;
        return (
            <div className="loginForm container mx-auto">
                <Form.Control
                    className="my-4"
                    as="select"
                    custom
                    onClick={this.onLanguageChange}
                >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                </Form.Control>
                <img alt="logo" className="logo mx-auto mb-4" src={logo} />
                <div className="text-center mb-4">
                    {t("Administration interface")}
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
                                name="userName"
                                onChange={this.onChange}
                                placeholder={t("Name")}
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
                                placeholder={t("Password")}
                                required
                                type="password"
                                value={this.state.password}
                            />
                        </InputGroup>
                    </Form.Group>
                    <Button variant="outline-primary btn-block" type="submit">
                        {t("Sign in")}
                    </Button>
                </Form>
            </div>
        );
    }
}

export default withNamespaces("common")(Login);
