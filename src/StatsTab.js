import React, { useContext, useEffect, useState } from "react";
import { withTranslation } from "react-i18next";

import CardStats from "./CardStats";
import MatrixClientContext from "./MatrixClientContext";

import logo from "./images/logo.svg";

export default withTranslation()(({ onTabSelected, t }) => {
    const client = useContext(MatrixClientContext);

    const [stats, setStats] = useState(null);
    const [serverReport, setServerReport] = useState(null);

    useEffect(() => {
        getStats();
        getServerState();
    }, []);

    const getServerState = async () => {
        try {
            const SERVER_REPORT_REQUET = await fetch(
                new URL(
                    "_matrix/client/r0/watcha_server_state",
                    client.baseUrl
                ),
                {
                    method: "GET",
                    headers: {
                        Authorization: "Bearer " + client.getAccessToken(),
                    },
                }
            );
            setServerReport(JSON.parse(await SERVER_REPORT_REQUET.text()));
        } catch (e) {
            console.log("error: " + e);
        }
    };

    const getStats = async () => {
        try {
            const STATS_REQUEST = await fetch(
                new URL("_matrix/client/r0/watcha_admin_stats", client.baseUrl),
                {
                    method: "GET",
                    headers: {
                        Authorization: "Bearer " + client.getAccessToken(),
                    },
                }
            );
            setStats(JSON.parse(await STATS_REQUEST.text()));
        } catch (e) {
            console.log("error: " + e);
        }
    };

    let membersData;
    let partnersData;
    let bigRoomsData;
    let oneToOneData;
    let activeRooms;
    let Admin;
    const userLines = [];
    const roomLines = [];
    if (stats) {
        membersData = stats["users"]["local"];
        partnersData = stats["users"]["partners"];
        bigRoomsData = stats["rooms"]["one_one_rooms_count"];
        oneToOneData = stats["rooms"]["big_rooms_count"];
        activeRooms = stats["rooms"]["big_rooms_count_active"];
        Admin = stats["admins"];
        userLines.push(
            { label: t("Members"), data: membersData },
            { label: t("Partners"), data: partnersData },
            { label: t("Admin"), data: Admin }
        );
        roomLines.push(
            { label: t("Active rooms"), data: activeRooms },
            { label: t("One-to-one conversations"), data: oneToOneData },
            { label: t("Inactive Rooms"), data: bigRoomsData - activeRooms }
        );
    }
    // let buttonReport;
    // if (serverReport) {
    //     buttonReport = (
    //         <div>
    //             <Button>Generate report</Button>
    //         </div>
    //     );
    // }
    if (!stats) {
        return (
            <div className="loading">
                <div>
                    <div className="logoRow">
                        <img alt="logo " src={logo} className="logo" />
                    </div>
                    <div className="loadingText">
                        {t("Loading")}
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="statsPanelsContainer">
                <CardStats
                    lines={userLines}
                    title={t("Users")}
                    {...{ onTabSelected }}
                />
                <CardStats
                    lines={roomLines}
                    title={t("Rooms")}
                    {...{ onTabSelected }}
                />
            </div>
            {/* buttonReport */}
        </div>
    );
});
