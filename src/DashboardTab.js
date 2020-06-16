import React, { Component } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Col";
import UsersDashboardPanel from "./UsersDashboardPanel";
import RoomsDashboardPanel from "./RoomsDashboardPanel";
import ServerStateDashboardPanel from "./ServerStateDashboardPanel";
import CardDeck from "react-bootstrap/CardDeck";
import DelayedSpinner from "./DelayedSpinner";
import RefreshButton from "./RefreshButton";
import { MatrixClientContext } from "./contexts";

class DashboardTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiAdress: "_matrix/client/r0/watcha_admin_stats",
            datas: undefined,
            loading: true,
        };
    }

    static contextType = MatrixClientContext;

    getDatas = async () => {
        const client = this.context;
        let datas;
        try {
            const adminStatsRequest = await fetch(
                new URL(this.state.apiAdress, client.baseUrl),
                {
                    method: "GET",
                    headers: {
                        Authorization: "Bearer " + client.getAccessToken(),
                    },
                }
            );
            datas = JSON.parse(await adminStatsRequest.text());
        } catch (e) {
            console.log("error: " + e);
            return;
        }

        this.setState({ datas, loading: false });
    };

    componentDidMount() {
        this.getDatas();
    }

    render() {
        return this.state.loading || !this.state.datas ? (
            <DelayedSpinner />
        ) : (
            <div>
                <RefreshButton onClick={this.getDatas} variant="primary" />

                <CardDeck className="dashboardPanelsContainer">
                    <Col>
                        <RoomsDashboardPanel
                            datas={this.state.datas.rooms}
                            tab="rooms"
                        />
                        <ServerStateDashboardPanel
                            datas={this.state.datas.server}
                        />
                    </Col>
                    <Col>
                        <UsersDashboardPanel
                            datas={this.state.datas.users}
                            tab="users"
                        />
                    </Col>
                </CardDeck>
            </div>
        );
    }
}

export default DashboardTab;
