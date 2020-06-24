import React from "react";
import { useTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";

import AdministrateButton from "./AdministrateButton";
import AdministratorList from "./AdministratorList";
import PanelRow from "./PanelRow";
import Tooltip from "./Tooltip";

import "./css/DashboardPanel.scss";
import "./css/UsersDashboardPanel.scss";

export default ({ usersMetrics }) => {
    const { t } = useTranslation("dashboardTab");

    const { administrators_users } = usersMetrics;

    const {
        administrators,
        collaborators,
        partners,
    } = usersMetrics.users_per_role;

    const {
        number_of_users_logged_at_least_once,
        number_of_last_month_logged_users,
        number_of_last_week_logged_users,
    } = usersMetrics.connected_users;

    const {
        number_of_users_with_pending_invitation,
    } = usersMetrics.other_statistics;

    const usersPerRoleSection = (
        <div className="UsersDashboardPanel_panelSection">
            <span className="UsersDashboardPanel_panelSectionTitle">
                {t(`usersPanel.usersPerRole`)}
            </span>
            <PanelRow
                label={
                    <>
                        {t("common:administrators")}
                        <Tooltip tooltipName="administrator" />
                        <AdministratorList
                            administratorList={administrators_users}
                        />
                    </>
                }
                value={administrators}
            />
            <PanelRow
                label={
                    <>
                        {t("common:collaborators")}
                        <Tooltip tooltipName="collaborator" />
                    </>
                }
                value={collaborators}
            />
            <PanelRow
                label={
                    <>
                        {t("common:partners")}
                        <Tooltip tooltipName="partner" />
                    </>
                }
                value={partners}
            />
        </div>
    );

    const connectedUsersSection = (
        <div className="UsersDashboardPanel_panelSection">
            <span className="UsersDashboardPanel_panelSectionTitle">
                {t(`usersPanel.connectedUsers`)}
            </span>
            <PanelRow
                label={t("usersPanel.loggedUsers")}
                value={number_of_users_logged_at_least_once}
            />
            <PanelRow
                label={t("usersPanel.monthlyUsers")}
                value={number_of_last_month_logged_users}
            />
            <PanelRow
                label={t("usersPanel.weeklyUsers")}
                value={number_of_last_week_logged_users}
            />
        </div>
    );

    const otherStatisticsSection = (
        <div className="UsersDashboardPanel_panelSection">
            <span className="UsersDashboardPanel_panelSectionTitle">
                {t(`usersPanel.otherStatistics`)}
            </span>
            <PanelRow
                label={
                    <>
                        {t("usersPanel.pendingInvitationUsers")}
                        <Tooltip tooltipName="pendingInvitation" />
                    </>
                }
                value={number_of_users_with_pending_invitation}
            />
        </div>
    );

    return (
        <Card className="DashboardPanel">
            <Card.Header>
                <span>{t(`usersPanel.title`)}</span>
                <AdministrateButton targetTab="users">
                    {t("usersPanel.administrateButton")}
                </AdministrateButton>
            </Card.Header>
            <Card.Body className="DashboardPanel_body">
                {usersPerRoleSection}
                {connectedUsersSection}
                {otherStatisticsSection}
            </Card.Body>
        </Card>
    );
};
