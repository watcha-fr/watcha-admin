import React from "react";
import { useGet } from "restful-react";
import { useTranslation } from "react-i18next";

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
                <CardStats
                    lines={[
                        { label: t("dashboardTab:collaborators"), data: data.users.collaborators },
                        { label: t("dashboardTab:partners"), data: data.users.partners },
                        { label: t("dashboardTab:weeklyUsers"), data: data.users.number_of_last_week_logged_users },
                        { label: t("dashboardTab:monthlyUsers"), data: data.users.number_of_last_month_logged_users },
                        { label: t("dashboardTab:loggedUsers"), data: data.users.number_of_users_logged_at_least_once },
                        { label: t("dashboardTab:pendingInvitationUsers"), data: data.users.number_of_users_with_pending_invitation },
                        { label: t("dashboardTab:admin"), data: data.admins },
                    ]}
                    title={t("usersTab:title")}
                    tab="users"
                />
                <CardStats
                    lines={[
                        {
                            label: t("Number of rooms"),
                            data: data.rooms.non_direct_rooms_count,
                        },
                        {
                            label: t("Of which active rooms"),
                            data: data.rooms.non_direct_active_rooms_count,
                        },
                        {
                            label: t("Number of personnals conversations"),
                            data: data.rooms.direct_rooms_count,
                        },
                        {
                            label: t("Of which active personnals conversations"),
                            data: data.rooms.direct_active_rooms_count,
                        },

                    ]}
                    title={t("roomsTab:title")}
                    tab="rooms"
                />
            </div>
        </div>
    );
};
