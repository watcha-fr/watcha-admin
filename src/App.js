import React, { Component } from "react";
import logo from "./images/logo.svg";
import "./App.css";
import AdminHome from "./AdminHome.js";
import {
    Button,
    FormGroup,
    FormControl,
    Col,
    Form,
    Grid,
    Row,
} from "react-bootstrap";
import { withNamespaces } from "react-i18next";

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

    onConnection = async () => {
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

    handleChange = event =>
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
            <div>
                <Grid className="container">
                    <Row className="logoRow">
                        <Col
                            lg={4}
                            sm={12}
                            md={4}
                            xs={12}
                            mdOffset={4}
                            smOffset={0}
                            xsOffset={0}
                        >
                            <img alt="logo " src={logo} className="logo" />
                        </Col>
                    </Row>
                    <Row className="show-grid">
                        <Col
                            lg={6}
                            sm={12}
                            md={6}
                            xs={12}
                            mdOffset={3}
                            smOffset={0}
                            xsOffset={0}
                        >
                            <Form
                                className="loginInput"
                                onSubmit={event => {
                                    event.preventDefault();
                                    this.onConnection();
                                }}
                            >
                                <FormGroup controlId="formHorizontalName">
                                    <FormControl
                                        name="userName"
                                        type="text"
                                        placeholder={this.props.t("Name")}
                                        autoComplete="username"
                                        value={this.state.userName}
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                                <FormGroup controlId="formHorizontalPassword">
                                    <FormControl
                                        name="password"
                                        type="password"
                                        placeholder="Password"
                                        autoComplete="current-password"
                                        value={this.state.password}
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                                <Button
                                    bsStyle="primary"
                                    className="SubmitButton"
                                    type="submit"
                                >
                                    {this.props.t("Sign in")}
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                    <div>
                        <select
                            className="languageDropdown"
                            onClick={this.onLanguageChange}
                        >
                            <option value="fr">Français</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                </Grid>
            </div>
        );
    }
}

export default withNamespaces("common")(App);
