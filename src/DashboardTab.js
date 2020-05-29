import React from "react";
import { useGet } from "restful-react";
import Col from "react-bootstrap/Col";
import UsersDashboardPanel from "./UsersDashboardPanel";
import RoomsDashboardPanel from "./RoomsDashboardPanel";
import ServerStateDashboardPanel from "./ServerStateDashboardPanel";
import CardDeck from "react-bootstrap/CardDeck";
import DelayedSpinner from "./DelayedSpinner";

export default () => {
    const { data, loading, error } = useGet({ path: "watcha_admin_stats" });

    if (error) {
        console.error(error);
    }

    return loading || !data ? (
        <DelayedSpinner />
    ) : (
        <CardDeck className="dashboardPanelsContainer">
            <Col>
                <RoomsDashboardPanel datas={data.rooms} tab="rooms" />
                <ServerStateDashboardPanel datas={data.server} />
            </Col>
            <Col>
                <UsersDashboardPanel datas={data.users} tab="users" />
            </Col>
        </CardDeck>
    );
};
