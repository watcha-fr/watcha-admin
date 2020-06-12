import React, { Component } from "react";
import Col from "react-bootstrap/Col";
import CardDeck from "react-bootstrap/CardDeck";
import DelayedSpinner from "./DelayedSpinner";
import RefreshButton from "./Buttons/RefreshButton";
import DashboardPanel from "./DashboardPanel";
import { MatrixClientContext } from "./contexts";

class DashboardTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiAdress: "_matrix/client/r0/watcha_admin_stats",
            data: undefined,
            loading: true,
        };
    }

    static contextType = MatrixClientContext;

    getDatas = async () => {
        const client = this.context;
        let data;
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
            data = JSON.parse(await adminStatsRequest.text());
        } catch (e) {
            console.log("error: " + e);
            return;
        }
        this.setState({ data, loading: false });
    };

    componentDidMount() {
        this.getDatas();
    }

    render() {
        return this.state.loading || !this.state.data ? (
            <DelayedSpinner />
        ) : (
            <div>
                <RefreshButton onClick={this.getDatas} variant="primary" />

                <CardDeck className="dashboardPanelsContainer">
                    <Col>
                        <DashboardPanel
                            panelName="roomsPanel"
                            panelInformations={this.state.data.rooms}
                            administrateButtonTabDestination="rooms"
                        />
                        <DashboardPanel
                            panelName="serverStatePanel"
                            panelInformations={this.state.data.server}
                        />
                    </Col>
                    <Col>
                        <DashboardPanel
                            panelName="usersPanel"
                            panelInformations={this.state.data.users}
                            administrateButtonTabDestination="users"
                        />
                    </Col>
                </CardDeck>
            </div>
        );
    }
}

export default DashboardTab;
