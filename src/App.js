import React, { Suspense, useEffect, useState } from "react";
import { RestfulProvider } from "restful-react";
import sdk from "matrix-js-sdk";

import AdminHome from "./AdminHome";
import DelayedSpinner from "./DelayedSpinner";
import Login from "./Login";
import { MatrixClientContext } from "./contexts";

import "./css/App.scss";

export default () => {
    const [client, setClient] = useState(null);
    const [clientPrepared, setClientPrepared] = useState(false);
    const [missingAccessToken, setMissingAccessToken] = useState(false);

    useEffect(() => {
        Promise.resolve(getHsBaseUrl()).then(baseUrl => {
            let client;
            const accessToken = localStorage.getItem("mx_access_token");
            const userId = localStorage.getItem("mx_user_id");

            if (accessToken && userId) {
                client = sdk.createClient({
                    baseUrl,
                    accessToken,
                    userId,
                });
                setupClient(client);
            } else {
                client = sdk.createClient({ baseUrl });
                setMissingAccessToken(true);
            }
            setClient(client);
        });
    }, []);

    const getHsBaseUrl = () =>
        localStorage.getItem("mx_hs_url") ||
        fetch("/.well-known/matrix/client")
            .then(response => response.json())
            .then(data => {
                console.log(`.well-known discovery: ${data}`);
                return data["m.homeserver"]["base_url"];
            })
            .catch(error => {
                const hsBaseUrl = process.env.HS_URL || "http://localhost:8008";
                console.log(`Set ${hsBaseUrl} as home server url`);
                return hsBaseUrl;
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
        client.on("Session.logged_out", error => {
            console.error(error.message);
            Promise.resolve(getHsBaseUrl()).then(baseUrl => {
                client = sdk.createClient({ baseUrl });
                setClient(client);
                setMissingAccessToken(true);
            });
        });
    };

    const getRestfulConfig = () => ({
        base: new URL("_matrix/client/r0", client.baseUrl).href,
        requestOptions: {
            headers: {
                Authorization: `Bearer ${client.getAccessToken()}`,
            },
        },
        onError: (error, retry, repsonse) => {
            repsonse && console.error(repsonse);
        },
    });

    return (
        <Suspense fallback={<DelayedSpinner />}>
            <MatrixClientContext.Provider value={client}>
                {clientPrepared ? (
                    <RestfulProvider {...getRestfulConfig()}>
                        <AdminHome />
                    </RestfulProvider>
                ) : missingAccessToken ? (
                    <Login {...{ setupClient }} />
                ) : (
                    <DelayedSpinner />
                )}
            </MatrixClientContext.Provider>
        </Suspense>
    );
};
