import React, { Component } from "react";
import CardStats from "./CardStats";
import { withTranslation } from "react-i18next";
import logo from "./images/logo.svg";
class StatsTab extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount = () => {
        this.getStats();
        this.getServerState();
    };

    getServerState = async () => {
        let serverReport;
        const HOME_SERVER = this.props.server;
        const ACCESS_TOKEN = this.props.token;

        try {
            const SERVER_REPORT_REQUET = await fetch(
                new URL("_matrix/client/r0/watcha_server_state", HOME_SERVER),
                {
                    method: "GET",
                    headers: {
                        Authorization: "Bearer " + ACCESS_TOKEN,
                    },
                }
            );

            serverReport = JSON.parse(await SERVER_REPORT_REQUET.text());
        } catch (e) {
            console.log("error: " + e);
            return;
        }
        this.setState({
            serverReport,
        });
    };

    getStats = async () => {
        let statsData;
        const HOME_SERVER = this.props.server;
        const ACCESS_TOKEN = this.props.token;

        try {
            const STATS_REQUEST = await fetch(
                new URL("_matrix/client/r0/watcha_admin_stats", HOME_SERVER),
                {
                    method: "GET",
                    headers: {
                        Authorization: "Bearer " + ACCESS_TOKEN,
                    },
                }
            );

            statsData = JSON.parse(await STATS_REQUEST.text());
        } catch (e) {
            console.log("error: " + e);
            return;
        }
        this.setState({
            stats: statsData,
        });
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
