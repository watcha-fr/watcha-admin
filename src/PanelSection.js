import React from "react";
import { useTranslation } from "react-i18next";
import PanelRow from "./PanelRow";
import Table from "react-bootstrap/Table";

const ns = "dashboardTab";

export default ({ panelSectionName, panelSectionInformations, administratorList }) => {
    const { t } = useTranslation(ns);

    const usersPerRoleSection = (
        <tbody>
            <PanelRow
                label={t("usersPanel.administrators")}
                value={`${panelSectionInformations.administrators}`}
                {...{administratorList}}
            />
            <PanelRow
                label={t("usersPanel.collaborators")}
                value={`${panelSectionInformations.collaborators}`}
            />
            <PanelRow
                label={t("usersPanel.partners")}
                value={`${panelSectionInformations.partners}`}
            />
        </tbody>
    );

    const connectedUsersSection = (
        <tbody>
            <PanelRow
                label={t("usersPanel.loggedUsers")}
                value={`${panelSectionInformations.number_of_users_logged_at_least_once}`}
            />
            <PanelRow
                label={t("usersPanel.monthlyUsers")}
                value={`${panelSectionInformations.number_of_last_month_logged_users}`}
            />
            <PanelRow
                label={t("usersPanel.weeklyUsers")}
                value={`${panelSectionInformations.number_of_last_week_logged_users}`}
            />
        </tbody>
    );

    const otherStatisticsSection = (
        <tbody>
            <PanelRow
                label={t("usersPanel.pendingInvitationUsers")}
                value={`${panelSectionInformations.number_of_users_with_pending_invitation}`}
            />
        </tbody>
    );

    return (
        <fieldset className="watcha-fieldset">
            <legend className="watcha-legend">
                {t(`usersPanel.${panelSectionName}`)}
            </legend>
            <Table>
                {panelSectionName === "usersPerRole" && usersPerRoleSection}
                {panelSectionName === "connectedUsers" && connectedUsersSection}
                {panelSectionName === "otherStatistics" &&
                    otherStatisticsSection}
            </Table>
        </fieldset>
    );
};
