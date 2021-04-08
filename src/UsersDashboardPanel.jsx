import React from "react";
import PropTypes from "prop-types";

import { Trans, useTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";

import AdministratorList from "./AdministratorList";
import LabelTooltip from "./LabelTooltip";
import PanelRow from "./PanelRow";

import "./css/DashboardPanel.scss";
import "./css/UsersDashboardPanel.scss";

const UsersDashboardPanel = ({ usersMetrics }) => {
    const { t } = useTranslation("dashboardTab");

    // eslint-disable-next-line camelcase
    const { administrators_users } = usersMetrics;

    const { administrators, collaborators, partners } = usersMetrics.users_per_role;

    /* eslint-disable camelcase */
    const {
        number_of_users_logged_at_least_once,
        number_of_last_month_logged_users,
        number_of_last_week_logged_users,
    } = usersMetrics.connected_users;
    /* eslint-enable camelcase */

    const administratorPopoverContent = (
        <p>
            <Trans t={t} i18nKey="usersTab:roleHeaderTooltip.content.administrator" />
        </p>
    );

    const collaboratorPopoverContent = (
        <p>
            <Trans t={t} i18nKey="usersTab:roleHeaderTooltip.content.collaborator" />
        </p>
    );

    const partnerPopoverContent = (
        <p>
            <Trans t={t} i18nKey="usersTab:roleHeaderTooltip.content.partner" />
        </p>
    );

    const usersPerRoleSection = (
        <div className="UsersDashboardPanel_panelSection">
            <span className="UsersDashboardPanel_panelSectionTitle">{t(`usersPanel.usersPerRole`)}</span>
            <PanelRow
                label={
                    <>
                        {t("common:administrators")}
                        <LabelTooltip popoverContent={administratorPopoverContent} />
                        {/* eslint-disable-next-line camelcase */}
                        <AdministratorList administratorList={administrators_users} />
                    </>
                }
                value={administrators}
            />
            <PanelRow
                label={
                    <>
                        {t("common:collaborators")}
                        <LabelTooltip popoverContent={collaboratorPopoverContent} />
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
            <span className="UsersDashboardPanel_panelSectionTitle">{t(`usersPanel.connectedUsers`)}</span>
            {/* eslint-disable camelcase */}
            <PanelRow label={t("usersPanel.loggedUsers")} value={number_of_users_logged_at_least_once} />
            <PanelRow label={t("usersPanel.monthlyUsers")} value={number_of_last_month_logged_users} />
            <PanelRow label={t("usersPanel.weeklyUsers")} value={number_of_last_week_logged_users} />
            {/* eslint-enable camelcase */}
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

UsersDashboardPanel.propTypes = {
    usersMetrics: PropTypes.shape({
        administrators_users: PropTypes.arrayOf(
            PropTypes.shape({
                user_id: PropTypes.string.isRequired,
                email: PropTypes.string.isRequired,
                displayname: PropTypes.string.isRequired,
            })
        ),
        users_per_role: PropTypes.shape({
            administrators: PropTypes.number.isRequired,
            collaborators: PropTypes.number.isRequired,
            partners: PropTypes.number.isRequired,
        }),
        connected_users: PropTypes.shape({
            number_of_users_logged_at_least_once: PropTypes.number.isRequired,
            number_of_last_month_logged_users: PropTypes.number.isRequired,
            number_of_last_week_logged_users: PropTypes.number.isRequired,
        }),
    }).isRequired,
};

export default UsersDashboardPanel;
