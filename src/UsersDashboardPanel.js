import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";

import AdministratorList from "./AdministratorsList";
import ExpandButton from "./ExpandButton";
import PanelRow from "./PanelRow";
import Tooltip from "./Tooltip";

import "./css/DashboardPanel.scss";
import "./css/UsersDashboardPanel.scss";

export default ({ usersPanelInformations, children }) => {
    const { t } = useTranslation("dashboardTab");

    const [isExpanded, setIsExpand] = useState(false);

    const onExpandButtonClick = () => {
        isExpanded ? setIsExpand(false) : setIsExpand(true);
    };

    const usersPerRoleSection = (
        <div className="UsersDashboardPanel_panelSection">
            <span className="UsersDashboardPanel_panelSectionTitle">
                ○ {t(`usersPanel.usersPerRole`)}
            </span>
            <PanelRow
                label={t("common:administrators")}
                value={usersPanelInformations.users_per_role.administrators}
            >
                <Tooltip tooltipName="administrator" />
                <ExpandButton onClick={onExpandButtonClick} />
            </PanelRow>
            {isExpanded && (
                <AdministratorList
                    administratorList={
                        usersPanelInformations.administrators_users
                    }
                />
            )}
            <PanelRow
                label={t("common:collaborators")}
                value={usersPanelInformations.users_per_role.collaborators}
            >
                <Tooltip tooltipName="collaborator" />
            </PanelRow>
            <PanelRow
                label={t("common:partners")}
                value={usersPanelInformations.users_per_role.partners}
            >
                <Tooltip tooltipName="partner" />
            </PanelRow>
        </div>
    );

    const connectedUsersSection = (
        <div className="UsersDashboardPanel_panelSection">
            <span className="UsersDashboardPanel_panelSectionTitle">
                ○ {t(`usersPanel.connectedUsers`)}
            </span>
            <PanelRow
                label={t("usersPanel.loggedUsers")}
                value={
                    usersPanelInformations.connected_users
                        .number_of_users_logged_at_least_once
                }
            />
            <PanelRow
                label={t("usersPanel.monthlyUsers")}
                value={
                    usersPanelInformations.connected_users
                        .number_of_last_month_logged_users
                }
            />
            <PanelRow
                label={t("usersPanel.weeklyUsers")}
                value={
                    usersPanelInformations.connected_users
                        .number_of_last_week_logged_users
                }
            />
        </div>
    );

    const otherStatisticsSection = (
        <div className="UsersDashboardPanel_panelSection">
            <span className="UsersDashboardPanel_panelSectionTitle">
                ○ {t(`usersPanel.otherStatistics`)}
            </span>
            <PanelRow
                label={t("usersPanel.pendingInvitationUsers")}
                value={
                    usersPanelInformations.other_statistics
                        .number_of_users_with_pending_invitation
                }
            >
                <Tooltip tooltipName="pendingInvitation" />
            </PanelRow>
        </div>
    );

    return (
        <Card className="DashboardPanel">
            <Card.Header>
                <span>{t(`usersPanel.title`)}</span>
                {children}
            </Card.Header>
            <Card.Body>
                <Row className="DashboardPanel_body">
                    {usersPerRoleSection}
                    {connectedUsersSection}
                    {otherStatisticsSection}
                </Row>
            </Card.Body>
        </Card>
    );
};
