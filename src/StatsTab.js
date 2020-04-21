import React from "react";
import { useGet } from "restful-react";
import { withTranslation } from "react-i18next";

import CardStats from "./CardStats";
import DelayedSpinner from "./DelayedSpinner";

export default withTranslation()(({ onTabSelected, t }) => {
    const { data, loading, error } = useGet({ path: "watcha_admin_stats" });

    if (error) {
        console.error(error);
    }

    return loading ? (
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
                    title={t("Users")}
                    {...{ onTabSelected }}
                />
                <CardStats
                    lines={[
                        {
                            label: t("Active rooms"),
                            data: data.rooms.big_rooms_count_active,
                        },
                        {
                            label: t("One-to-one conversations"),
                            data: data.rooms.big_rooms_count,
                        },
                        {
                            label: t("Inactive Rooms"),
                            data:
                                data.rooms.one_one_rooms_count -
                                data.rooms.big_rooms_count_active,
                        },
                    ]}
                    title={t("Rooms")}
                    {...{ onTabSelected }}
                />
            </div>
        </div>
    );
});
