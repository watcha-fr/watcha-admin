import React from "react";
import { withTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import { useDispatchContext } from "./contexts";

export default withTranslation()(({ t, datas, tab }) => {
    const standardSections = [
        {
            title: t("dashboardTab:usersPanel.usersPerRole"),
            labels: [
                t("dashboardTab:usersPanel.administrators"),
                t("dashboardTab:usersPanel.collaborators"),
                t("dashboardTab:usersPanel.partners"),
            ],
            datas: [
                datas.users_per_role.administrators,
                datas.users_per_role.collaborators,
                datas.users_per_role.partners,
            ],
        },
        {
            title: t("dashboardTab:usersPanel.connectedUsers"),
            labels: [
                t("dashboardTab:usersPanel.loggedUsers"),
                t("dashboardTab:usersPanel.monthlyUsers"),
                t("dashboardTab:usersPanel.weeklyUsers"),
            ],
            datas: [
                datas.connected_users.number_of_users_logged_at_least_once,
                datas.connected_users.number_of_last_month_logged_users,
                datas.connected_users.number_of_last_week_logged_users,
            ],
        },
        {
            title: t("dashboardTab:usersPanel.otherStatistics"),
            labels: [t("dashboardTab:usersPanel.pendingInvitationUsers")],
            datas: [
                datas.other_statistics.number_of_users_with_pending_invitation,
            ],
        },
    ];

    const dispatch = useDispatchContext();

    const onAdministrateLinkClick = () => dispatch({ tab });

    const onAdminUserClick = userId =>
        dispatch({ tab: "users", userId });

    const getStandardPanelContent = sections => {
        const panelContent = [];
        for (const index in sections) {
            const section = sections[index];
            if (section.datas) {
                const sectionContent = [];
                for (const index in section.labels) {
                    sectionContent.push(
                        <tr key={section.labels[index]}>
                            <td className="sectionPanelLabel">
                                {section.labels[index]}
                            </td>
                            <td className="sectionPanelData">
                                {section.datas[index]}
                            </td>
                        </tr>
                    );
                }
                if (sectionContent) {
                    panelContent.push(
                        <Row
                            className="dashboardPanelSection"
                            key={section.title}
                        >
                            <Card>
                                <Card.Header>
                                    <Card.Title>{section.title}</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <Table>
                                        <tbody>{sectionContent}</tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Row>
                    );
                }
            }
        }
        return panelContent;
    };

    const getAdminPanelContent = adminList => {
        const adminPanelContent = [];
        const sectionContent = [];
        for (const index in adminList) {
            const admin = adminList[index];
            sectionContent.push(
                <tr key={admin.user_id}>
                    <td
                        className="adminUserRow"
                        onClick={() => onAdminUserClick(admin.user_id)}
                    >
                        {`${setAdminName(admin.displayname, admin.user_id)} (${
                            admin.email
                        })`}
                    </td>
                </tr>
            );
        }
        if (sectionContent) {
            adminPanelContent.push(
                <Row
                    className="dashboardPanelSection"
                    id="adminListSection"
                    key={t("dashboardTab:usersPanel.administratorsList")}
                >
                    <Accordion defaultActiveKey="0">
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="1">
                                {t(
                                    "dashboardTab:usersPanel.administratorsList"
                                )}
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="1">
                                <Card.Body>
                                    {" "}
                                    <Table>
                                        <tbody>{sectionContent}</tbody>
                                    </Table>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </Row>
            );
        }

        return adminPanelContent;
    };

    const setAdminName = (displayname, adminUserID) => {
        return displayname || adminUserID.replace("@", "").split(":")[0];
    };

    const standardPanelContent = getStandardPanelContent(standardSections);

    const adminListPanelContent = getAdminPanelContent(
        datas.administrators_users
    );

    return (
        <Card className="dashboardPanel">
            <Card.Header>
                <span>{t("usersTab:title")}</span>
                <Button
                    className="dashboardAdministrateButton"
                    onClick={onAdministrateLinkClick}
                >
                    {t("dashboardTab:usersPanel.administrateButton")}
                </Button>
            </Card.Header>
            <Card.Body>
                <Container fluid>
                    {adminListPanelContent}
                    {standardPanelContent}
                </Container>
            </Card.Body>
        </Card>
    );
});
