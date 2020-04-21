import React, { Component } from "react";
import { withTranslation } from "react-i18next";

import CardStats from "./CardStats";
import MatrixClientContext from "./MatrixClientContext";

import logo from "./images/logo.svg";

class StatsTab extends Component {
    constructor() {
        super();
        this.state = { stats: null };
    }

    static contextType = MatrixClientContext;

    componentDidMount() {
        this.getStats();
        this.getServerState();
    }

    getServerState = async () => {
        const client = this.context;
        let serverReport;

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
            serverReport = JSON.parse(await SERVER_REPORT_REQUET.text());
        } catch (e) {
            console.log("error: " + e);
            return;
        }
        this.setState({ serverReport });
    };

    getStats = async () => {
        const client = this.context;
        let statsData;

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
            statsData = JSON.parse(await STATS_REQUEST.text());
        } catch (e) {
            console.log("error: " + e);
            return;
        }
        this.setState({ stats: statsData });
    };

    render() {
        let membersData;
        let partnersData;
        let bigRoomsData;
        let oneToOneData;
        let activeRooms;
        let Admin;
        const { t } = this.props;
        const userLines = [];
        const roomLines = [];
        if (this.state.stats) {
            membersData = this.state.stats["users"]["local"];
            partnersData = this.state.stats["users"]["partners"];
            bigRoomsData = this.state.stats["rooms"]["one_one_rooms_count"];
            oneToOneData = this.state.stats["rooms"]["big_rooms_count"];
            activeRooms = this.state.stats["rooms"]["big_rooms_count_active"];
            Admin = this.state.stats["admins"];
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
        // if (this.state.serverReport) {
        //     buttonReport = (
        //         <div>
        //             <Button>Generate report</Button>
        //         </div>
        //     );
        // }
        if (!this.state.stats) {
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
                        onTabSelected={this.props.onTabSelected}
                    />
                    <CardStats
                        lines={roomLines}
                        title={t("Rooms")}
                        onTabSelected={this.props.onTabSelected}
                    />
                </div>
                {/* buttonReport */}
            </div>
        );
    }
}

export default withTranslation()(StatsTab);
