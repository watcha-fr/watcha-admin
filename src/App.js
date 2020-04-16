import React, { Component, Suspense } from "react";
import sdk from "matrix-js-sdk";

import Login from "./Login.js";
import AdminHome from "./AdminHome.js";
import ErrorBoundary from "./ErrorBoundary.js";

import "./App.css";
import "./User.css";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            client: null,
            loginError: false,
            clientPrepared: false,
        };
    }

    async componentDidMount() {
        const baseUrl =
            localStorage.getItem("mx_hs_url") ||
            (await this.getBaseUrlFromConfig());

        const client = sdk.createClient({ baseUrl });
        this.setState({ client });

        const accessToken = localStorage.getItem("mx_access_token");
        if (accessToken) {
            await client
                .loginWithToken(accessToken)
                .then(() => this.setupClient(client))
                .catch(error => {
                    this.setState({ loginError: true });
                    console.error(error.message);
                });
        } else {
            this.setState({ loginError: true });
        }
    }

    async getBaseUrlFromConfig() {
        return await fetch("/config.json")
            .then(response => response.json())
            .then(
                data =>
                    data["default_server_config"]["m.homeserver"]["base_url"]
            )
            .catch(error => {
                // should only occur if the browser cache was cleared or
                // in development environment when the chat and the
                // administration interface do not have the same domain
                const defaultHomeServer =
                    process.env.REACT_APP_CORE || "http://localhost:8008";
                console.log(`Set ${defaultHomeServer} as default home server`);
                return defaultHomeServer;
            });
    }

    setupClient = async client => {
        await client.startClient({ initialSyncLimit: 10 });
        client.on("sync", (state, prevState, response) => {
            if (state === "SYNCING" && prevState === "SYNCING") {
                return;
            }
            console.info("MatrixClient sync state => %s", state);
            if (state === "PREPARED") {
                this.setState({ clientPrepared: true });
            }
        });
    };

    render() {
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <ErrorBoundary>
                    {this.state.clientPrepared ? (
                        <AdminHome
                            className="AdminHome"
                            token={this.state.client.getAccessToken()}
                            server={this.state.client.baseUrl}
                        />
                    ) : this.state.loginError ? (
                        <Login
                            client={this.state.client}
                            setupClient={this.setupClient}
                        />
                    ) : null}
                </ErrorBoundary>
            </Suspense>
        );
    }
}

export default App;
