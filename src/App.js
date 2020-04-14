import React, { Component } from "react";
import { withNamespaces } from "react-i18next";

import Login from "./Login.js";
import AdminHome from "./AdminHome.js";

import "./App.css";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accessToken: null,
            homeserver: null,
        };
    }

    componentDidMount() {
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
    }

    connection = async (userName, password) => {
        try {
            const path = this.state.homeserver + "_matrix/client/r0/login";

            const loginRequest = await fetch(path, {
                method: "POST",
                body: JSON.stringify({
                    initial_device_display_name: "Web setup account",
                    user: userName,
                    password: password,
                    type: "m.login.password",
                }),
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
            const loginData = JSON.parse(await loginRequest.text());
            if (loginData["access_token"]) {
                this.setState({ accessToken: loginData["access_token"] });
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

    render() {
        return this.state.accessToken ? (
            <AdminHome
                className="AdminHome"
                token={this.state.accessToken}
                server={this.state.homeserver}
            />
        ) : (
            <Login connection={this.connection} />
        );
    }
}

export default withNamespaces("common")(App);
