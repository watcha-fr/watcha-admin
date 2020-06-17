import React, { useState, useEffect, useRef } from "react";
import { useGet } from "restful-react";
import Col from "react-bootstrap/Col";
import CardDeck from "react-bootstrap/CardDeck";
import DelayedSpinner from "./DelayedSpinner";
import DashboardPanel from "./DashboardPanel";

import "./css/DashboardTab.scss"

export default () => {
    const [loading, setLoading] = useState(true);

    const [dashboardInformations, setDashboardInformations] = useState([]);

    const { data, refetch } = useGet({
        path: "watcha_admin_stats",
        lazy: true,
    });

    const refetchRef = useRef();
    refetchRef.current = refetch;

    const intervalIdRef = useRef();

    useEffect(() => {
        refetchRef.current();
    }, []);

    useEffect(() => {
        setDashboardInformations(data);
        loading && setLoading(false);
        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
        }
        intervalIdRef.current = setInterval(() => refetchRef.current(), 10000);
    }, [data]);

    return loading || !dashboardInformations ? (
        <DelayedSpinner />
    ) : (
        <div>
            <CardDeck className="DashboardTab">
                <Col>
                    <DashboardPanel
                        panelName="roomsPanel"
                        panelInformations={dashboardInformations.rooms}
                        administrateButtonTabDestination="rooms"
                    />
                    <DashboardPanel
                        panelName="serverStatePanel"
                        panelInformations={dashboardInformations.server}
                    />
                </Col>
                <Col>
                    <DashboardPanel
                        panelName="usersPanel"
                        panelInformations={dashboardInformations.users}
                        administrateButtonTabDestination="users"
                    />
                </Col>
            </CardDeck>
        </div>
    );
};
