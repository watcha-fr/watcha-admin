import React from "react";
import { useGet } from "restful-react";
import { useTranslation } from "react-i18next";
import UsersDashboardPanel from "./UsersDashboardPanel";
import CardDeck from "react-bootstrap/CardDeck";
import DelayedSpinner from "./DelayedSpinner";

export default () => {
    const { t } = useTranslation();

    const { data, loading, error } = useGet({ path: "watcha_admin_stats" });

    if (error) {
        console.error(error);
    }

    return loading || !data ? (
        <DelayedSpinner />
    ) : (
        <CardDeck className="dashboardPanelsContainer">
            <UsersDashboardPanel datas={data.users} tab="users" />
        </CardDeck>
    );
};
