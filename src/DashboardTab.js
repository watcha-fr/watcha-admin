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
                        {
                            label: t("dashboardTab:usersPannel.collaborators"),
                            data: data.users.collaborators,
                        },
                        {
                            label: t("dashboardTab:usersPannel.partners"),
                            data: data.users.partners,
                        },
                        {
                            label: t("dashboardTab:usersPannel.weeklyUsers"),
                            data: data.users.number_of_last_week_logged_users,
                        },
                        {
                            label: t("dashboardTab:usersPannel.monthlyUsers"),
                            data: data.users.number_of_last_month_logged_users,
                        },
                        {
                            label: t("dashboardTab:usersPannel.loggedUsers"),
                            data:
                                data.users.number_of_users_logged_at_least_once,
                        },
                        {
                            label: t(
                                "dashboardTab:usersPannel.pendingInvitationUsers"
                            ),
                            data:
                                data.users
                                    .number_of_users_with_pending_invitation,
                        },
                        {
                            label: t("dashboardTab:usersPannel.admin"),
                            data: data.admins,
                        },
                    ]}
                    title={t("usersTab:title")}
                    footer={t("dashboardTab:usersPannel.footerLink")}
                    tab="users"
                />
                <CardStats
                    lines={
                        data.rooms.non_direct_rooms_count === 0 &&
                        data.rooms.direct_rooms_count === 0
                            ? []
                            : [
                                  {
                                      label: t(
                                          "dashboardTab:roomsPannel.nonDirectRoomsCount"
                                      ),
                                      data: data.rooms.non_direct_rooms_count,
                                  },
                                  {
                                      label: t(
                                          "dashboardTab:roomsPannel.nonDirectActiveRoomsCount"
                                      ),
                                      data:
                                          data.rooms
                                              .non_direct_active_rooms_count,
                                  },
                                  {
                                      label: t(
                                          "dashboardTab:roomsPannel.directRoomsCount"
                                      ),
                                      data: data.rooms.direct_rooms_count,
                                  },
                                  {
                                      label: t(
                                          "dashboardTab:roomsPannel.directActiveRoomsCount"
                                      ),
                                      data:
                                          data.rooms.direct_active_rooms_count,
                                  },
                              ]
                    }
                    title={t("roomsTab:title")}
                    footer={t("dashboardTab:roomsPannel.footerLink")}
                    tab="rooms"
                />
            </div>
        </div>
    );
};
