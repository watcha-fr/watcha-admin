import React from "react";
import { Trans, useTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";

import AdministratorList from "./AdministratorList";
import LabelTooltip from "./LabelTooltip";
import PanelRow from "./PanelRow";

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

    const administratorPopoverContent = (
        <p>
            <Trans
                t={t}
                i18nKey={"usersTab:roleHeaderTooltip.content.administrator"}
            />
        </p>
    );

    const collaboratorPopoverContent = (
        <p>
            <Trans
                t={t}
                i18nKey={"usersTab:roleHeaderTooltip.content.collaborator"}
            />
        </p>
    );

    const partnerPopoverContent = (
        <p>
            <Trans
                t={t}
                i18nKey={"usersTab:roleHeaderTooltip.content.partner"}
            />
        </p>
    );

    const usersPerRoleSection = (
        <div className="UsersDashboardPanel_panelSection">
            <span className="UsersDashboardPanel_panelSectionTitle">
                {t(`usersPanel.usersPerRole`)}
            </span>
            <PanelRow
                label={
                    <>
                        {t("common:administrators")}
                        <LabelTooltip
                            popoverContent={administratorPopoverContent}
                        />
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
                        <LabelTooltip
                            popoverContent={collaboratorPopoverContent}
                        />
                    </>
                }
                value={collaborators}
            />
            <PanelRow
                label={
                    <>
                        {t("common:partners")}
                        <LabelTooltip popoverContent={partnerPopoverContent} />
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

    return (
        <Card className="DashboardPanel">
            <Card.Header>
                <span>{t(`usersPanel.title`)}</span>
            </Card.Header>
            <Card.Body className="DashboardPanel_body">
                {usersPerRoleSection}
                {connectedUsersSection}
            </Card.Body>
        </Card>
    );
};
