import React from "react";
import { useGet } from "restful-react";
import { withTranslation } from "react-i18next";

import CardStats from "./CardStats";
import DelayedSpinner from "./DelayedSpinner";

export default withTranslation()(({ t }) => {
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
                        { label: t("Members"), data: data.users.local },
                        { label: t("Partners"), data: data.users.partners },
                        { label: t("Admin"), data: data.admins },
                    ]}
                    title={t("usersTab.title")}
                    tab="users"
                />
                <CardStats
                    lines={[
                        {
                            label: t("Number of rooms"),
                            data: data.rooms.non_direct_rooms_count,
                        },
                        {
                            label: t("Of which active"),
                            data: data.rooms.non_direct_active_rooms_count,
                        },
                        {
                            label: t("Number of personnals conversations"),
                            data: data.rooms.direct_rooms_count,
                        },
                        {
                            label: t("Of which active"),
                            data: data.rooms.direct_active_rooms_count,
                        },

                    ]}
                    title={t("roomsTab.title")}
                    tab="rooms"
                />
            </div>
        </div>
    );
});
