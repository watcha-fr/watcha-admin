import React from "react";
import { useTranslation } from "react-i18next";
import PanelRow from "./PanelRow";
import Table from "react-bootstrap/Table";

export default ({
    panelSectionName,
    panelSectionInformations,
    administratorList,
}) => {
    const { t } = useTranslation(["dashboardTab", "common"]);

    const usersPerRoleSection = (
        <tbody>
            <PanelRow
                label={t("common:administrators")}
                value={`${panelSectionInformations.administrators}`}
                {...{ administratorList }}
                tooltipName="administrator"
            />
            <PanelRow
                label={t("common:collaborators")}
                value={`${panelSectionInformations.collaborators}`}
                tooltipName="collaborator"
            />
            <PanelRow
                label={t("common:partners")}
                value={`${panelSectionInformations.partners}`}
                tooltipName="partner"
            />
        </tbody>
    );

    const connectedUsersSection = (
        <tbody>
            <PanelRow
                label={t("dashboardTab:usersPanel.loggedUsers")}
                value={`${panelSectionInformations.number_of_users_logged_at_least_once}`}
            />
            <PanelRow
                label={t("dashboardTab:usersPanel.monthlyUsers")}
                value={`${panelSectionInformations.number_of_last_month_logged_users}`}
            />
            <PanelRow
                label={t("dashboardTab:usersPanel.weeklyUsers")}
                value={`${panelSectionInformations.number_of_last_week_logged_users}`}
            />
        </tbody>
    );

    const otherStatisticsSection = (
        <tbody>
            <PanelRow
                label={t("dashboardTab:usersPanel.pendingInvitationUsers")}
                value={`${panelSectionInformations.number_of_users_with_pending_invitation}`}
                tooltipName="pendingInvitation"
            />
        </tbody>
    );

    return (
        <div>
            <span className="PanelSection_title">
                {t(`dashboardTab:usersPanel.${panelSectionName}`)}
            </span>
            <Table>
                {panelSectionName === "usersPerRole" && usersPerRoleSection}
                {panelSectionName === "connectedUsers" && connectedUsersSection}
                {panelSectionName === "otherStatistics" &&
                    otherStatisticsSection}
            </Table>
        </div>
    );
};
