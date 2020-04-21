import React, { Suspense, useEffect, useState } from "react";
import { RestfulProvider } from "restful-react";
import sdk from "matrix-js-sdk";

import AdminHome from "./AdminHome.js";
import ErrorBoundary from "./ErrorBoundary.js";
import Login from "./Login.js";
import MatrixClientContext from "./MatrixClientContext";
import SuspenseFallback from "./SuspenseFallback.js";

import "./App.css";

export default () => {
    const [client, setClient] = useState(null);
    const [clientPrepared, setClientPrepared] = useState(false);
    const [missingAccessToken, setMissingAccessToken] = useState(false);

    useEffect(() => {
        Promise.resolve(getBaseUrl()).then(baseUrl => {
            const client = sdk.createClient({ baseUrl });
            setClient(client);

            const accessToken = localStorage.getItem("mx_access_token");
            if (accessToken) {
                client
                    .loginWithToken(accessToken)
                    .then(() => setupClient(client))
                    .catch(error => {
                        setMissingAccessToken(true);
                        console.error(error.message);
                    });
            } else {
                setMissingAccessToken(true);
            }
        });
    }, []);

    const getBaseUrl = () =>
        localStorage.getItem("mx_hs_url") ||
        fetch("/config.json")
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

    const setupClient = async client => {
        await client.startClient({ initialSyncLimit: 10 });
        client.on("sync", (state, prevState, response) => {
            if (state === "SYNCING" && prevState === "SYNCING") {
                return;
            }
            console.info("MatrixClient sync state => %s", state);
            if (state === "PREPARED") {
                setClientPrepared(true);
            }
        });
    };

    const getRestfulConfig = () => ({
        base: new URL("_matrix/client/r0", client.baseUrl).href,
        requestOptions: {
            headers: {
                Authorization: `Bearer ${client.getAccessToken()}`,
            },
        },
    });

    return (
        <Suspense fallback={<SuspenseFallback />}>
            <ErrorBoundary>
                <MatrixClientContext.Provider value={client}>
                    {clientPrepared ? (
                        <RestfulProvider {...getRestfulConfig()}>
                            <AdminHome />
                        </RestfulProvider>
                    ) : missingAccessToken ? (
                        <Login {...{ setupClient }} />
                    ) : null}
                </MatrixClientContext.Provider>
            </ErrorBoundary>
        </Suspense>
    );
};
