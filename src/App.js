import React, { Component } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { withNamespaces } from "react-i18next";

import AdminHome from "./AdminHome.js";

import "./App.css";
import logo from "./images/logo.svg";

class App extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            userName: "",
            password: "",
            accessToken: null,
            homeserver: "",
        };
    }

    componentDidMount = () => {
        let accessToken = null;
        const search = window.location.search;
        if (search.includes("=")) {
            // Retrieving the token passed from Riot
            // see riot-web.git/src/components/structures/WatchaAdmin.js
            const key = search.split("=")[1];
            const value = localStorage.getItem("watcha-" + key);
            if (value !== null) {
                localStorage.removeItem("watcha-" + key);

                const { i18n } = this.props;
                i18n.changeLanguage(value.split("|")[0]);
                accessToken = value.split("|")[1];
            } else {
                // if the token was incorrect, or was already retrieved,
                // then redirect to Riot for security
                window.location =
                    window.location.protocol + "//" + window.location.host;
                return;
            }
        }

        fetch("/config.json")
            .then(response => response.json())
            .then(data =>
                this.setState({
                    homeserver:
                        data["default_server_config"]["m.homeserver"][
                            "base_url"
                        ] + "/",
                    accessToken,
                })
            )
            .catch(error => {
                // should only happen in dev - without token
                const defaultHomeServer =
                    process.env.REACT_APP_CORE || "http://localhost:8008";
                console.log("Defaulting homeserver to " + defaultHomeServer);
                this.setState({
                    homeserver: defaultHomeServer + "/",
                    accessToken,
                });
            });
    };

    onConnection = async event => {
        event.preventDefault();
        const self = this;

        try {
            const path = this.state.homeserver + "_matrix/client/r0/login";

            const loginRequest = await fetch(path, {
                method: "POST",
                body: JSON.stringify({
                    initial_device_display_name: "Web setup account",
                    user: self.state.userName,
                    password: self.state.password,
                    type: "m.login.password",
                }),
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
            const loginData = JSON.parse(await loginRequest.text());
            if (loginData["access_token"]) {
                self.setState({ accessToken: loginData["access_token"] });
                return this.state.accessToken;
            } else {
                // TODO: to test
                console.log("error: no access token");
                return;
            }
        } catch (e) {
            // TODO: is this useful ??
            console.log("error: " + e);

            return;
        }
    };

    onLanguageChange = evt => {
        const { i18n } = this.props;
        console.log(evt.target.value);
        i18n.changeLanguage(evt.target.value);
    };

    onChange = event =>
        this.setState({ [event.target.name]: event.target.value });

    render() {
        if (this.state.accessToken) {
            return (
                <AdminHome
                    token={this.state.accessToken}
                    server={this.state.homeserver}
                    className="AdminHome"
                    onLanguageChange={this.onLanguageChange}
                ></AdminHome>
            );
        }
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
                <img
                    alt="logo"
                    className="logo mx-auto mb-4"
                    src={logo}
                />
                <div className="text-center mb-4">
                    {this.props.t("Administration interface")}
                </div>
                <Form onSubmit={this.onConnection}>
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
                                placeholder={this.props.t("Name")}
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
                                placeholder="Password"
                                required
                                type="password"
                                value={this.state.password}
                            />
                        </InputGroup>
                    </Form.Group>
                    <Button variant="outline-primary btn-block" type="submit">
                        {this.props.t("Sign in")}
                    </Button>
                </Form>
            </div>
        );
    }
}

export default withNamespaces("common")(App);
