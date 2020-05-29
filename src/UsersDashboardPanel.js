import React from "react";
import { withTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { useDispatchContext } from "./contexts";
import infoCircle from "./images/info-circle.svg";

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

    const getInfoCircleTag = label => {
        let tooltipMessage = "";
        switch (label) {
            case t("dashboardTab:usersPanel.administrators"):
                tooltipMessage = t(
                    "dashboardTab:usersPanel.administratorTooltip"
                );
                break;
            case t("dashboardTab:usersPanel.collaborators"):
                tooltipMessage = t(
                    "dashboardTab:usersPanel.collaboratorTooltip"
                );
                break;
            case t("dashboardTab:usersPanel.partners"):
                tooltipMessage = t("dashboardTab:usersPanel.partnerTooltip");
                break;
            case t("dashboardTab:usersPanel.pendingInvitationUsers"):
                tooltipMessage = t(
                    "dashboardTab:usersPanel.pendingInvitationTooltip"
                );
                break;
            default:
                return;
        }

        const infoCircleTag = (
            <OverlayTrigger
                overlay={
                    <Popover className="tooltipMessage">
                        <Popover.Content>{tooltipMessage}</Popover.Content>
                    </Popover>
                }
                placement="right"
            >
                <img src={infoCircle}></img>
            </OverlayTrigger>
        );
        return infoCircleTag;
    };

    const dispatch = useDispatchContext();

    const onAdministrateLinkClick = () => dispatch({ tab });

    const onAdminUserClick = userId => dispatch({ tab: "users", userId });

    const getStandardPanelContent = sections => {
        const panelContent = [];
        for (const index in sections) {
            const section = sections[index];
            if (section.datas) {
                const sectionContent = [];
                for (const index in section.labels) {
                    const label = section.labels[index];
                    const labelCell =
                        label ===
                        t("dashboardTab:usersPanel.administrators") ? (
                            <td className="sectionPanelAdminListLabel">
                                {getAdminPanelContent(
                                    datas.administrators_users
                                )}
                            </td>
                        ) : (
                            <td className="sectionPanelLabel">
                                {label} {getInfoCircleTag(label)}
                            </td>
                        );

                    sectionContent.push(
                        <tr key={label}>
                            {labelCell}
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
                            <fieldset className="watcha-fieldset">
                                <legend className="watcha-legend">
                                    {section.title}
                                </legend>
                                <Table>
                                    <tbody>{sectionContent}</tbody>
                                </Table>
                            </fieldset>
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
                        {`${setAdminName(admin.displayname, admin.user_id)} ${
                            admin.email ? `(${admin.email})` : ""
                        }`}
                    </td>
                </tr>
            );
        }
        if (sectionContent) {
            adminPanelContent.push(
                <Accordion key={t("dashboardTab:usersPanel.administrators")} defaultActiveKey="0">
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="1">
                            {t("dashboardTab:usersPanel.administrators")}{" "}
                            {getInfoCircleTag(
                                t("dashboardTab:usersPanel.administrators")
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
            );
        }

        return adminPanelContent;
    };

    const setAdminName = (displayname, adminUserID) => {
        return displayname || adminUserID.replace("@", "").split(":")[0];
    };

    const standardPanelContent = getStandardPanelContent(standardSections);

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
                <Container fluid>{standardPanelContent}</Container>
            </Card.Body>
        </Card>
    );
});
