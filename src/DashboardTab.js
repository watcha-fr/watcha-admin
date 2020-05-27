import React from "react";
import { useGet } from "restful-react";
import { useTranslation } from "react-i18next";
import UsersDashboardPannel from "./UsersDashboardPannel"
import CardStats from "./CardStats";
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
        <div>
            <div className="statsPanelsContainer">
            </div>
        </div>
    );
};
