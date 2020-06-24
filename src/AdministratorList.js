import React from "react";
import { useDispatchContext } from "./contexts";
import { useTranslation } from "react-i18next";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";

import "./css/AdministratorsList.scss";
import icon from "./images/expand-button.svg";

export default ({ administratorList }) => {
    const { t } = useTranslation("dashboardTab");

    const dispatch = useDispatchContext();

    const onClick = userId => dispatch({ tab: "users", userId });

    const getDisplayName = user =>
        user.displayname || user.user_id.replace("@", "").split(":")[0];

    const getEmail = email => (email ? ` (${email})` : "");

    const administrators = administratorList.map(adminUser => (
        <div
            key={adminUser.user_id}
            className="AdministratorList_adminUserRow"
            onClick={() => onClick(adminUser.user_id)}
        >
            {getDisplayName(adminUser) + getEmail(adminUser.email)}
        </div>
    ));

    return (
        <Accordion className="AdministratorList" defaultActiveKey="1">
            <Card>
                <Accordion.Toggle
                    as={Card.Header}
                    eventKey="0"
                    title={t("usersPanel.expand")}
                >
                    <img src={icon} alt={t("usersPanel.expand")}></img>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>{administrators}</Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    );
};
