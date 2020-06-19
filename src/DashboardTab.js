import React, { useState, useEffect, useRef } from "react";
import { useGet } from "restful-react";
import CardDeck from "react-bootstrap/CardDeck";
import Col from "react-bootstrap/Col";

import AdministrateButton from "./AdministrateButton";
import ApplicationDashboardPanel from "./ApplicationDashboardPanel";
import DelayedSpinner from "./DelayedSpinner";
import RoomsDashboardPanel from "./RoomsDashboardPanel";
import UsersDashboardPanel from "./UsersDashboardPanel";

import "./css/DashboardTab.scss";

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
                    <RoomsDashboardPanel
                        roomsPanelInformations={dashboardInformations.rooms}
                    >
                        <AdministrateButton
                            panelName={"roomsPanel"}
                            tabDestination={"rooms"}
                        />
                    </RoomsDashboardPanel>
                    <ApplicationDashboardPanel
                        applicationPanelInformations={
                            dashboardInformations.server
                        }
                    />
                </Col>
                <Col>
                    <UsersDashboardPanel
                        usersPanelInformations={dashboardInformations.users}
                    >
                        <AdministrateButton
                            panelName={"usersPanel"}
                            tabDestination={"users"}
                        />
                    </UsersDashboardPanel>
                </Col>
            </CardDeck>
        </div>
    );
};
