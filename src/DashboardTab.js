import React, { useState, useEffect, useRef } from "react";
import { useGet } from "restful-react";
import CardDeck from "react-bootstrap/CardDeck";
import Col from "react-bootstrap/Col";

import ApplicationDashboardPanel from "./ApplicationDashboardPanel";
import DelayedSpinner from "./DelayedSpinner";
import RoomsDashboardPanel from "./RoomsDashboardPanel";
import UsersDashboardPanel from "./UsersDashboardPanel";

import "./css/DashboardTab.scss";

export default () => {
    const [loading, setLoading] = useState(true);

    const [metrics, setMetrics] = useState(null);

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
        setMetrics(data);
        loading && setLoading(false);
        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
        }
        intervalIdRef.current = setInterval(() => refetchRef.current(), 10000);
    }, [data]);

    return loading || !metrics ? (
        <DelayedSpinner />
    ) : (
        <CardDeck className="DashboardTab">
            <Col>
                <UsersDashboardPanel usersMetrics={metrics.users} />
            </Col>
            <Col>
                <RoomsDashboardPanel roomsMetrics={metrics.rooms} />
                <ApplicationDashboardPanel applicationMetrics={metrics.server} />
            </Col>
        </CardDeck>
    );
};
