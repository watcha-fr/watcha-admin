import React, { useReducer } from "react";
import { useTranslation } from "react-i18next";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { DispatchContext } from "./contexts";
import DashboardTab from "./DashboardTab";
// import MonitoringTab from './MonitoringTab';
import RoomsTab from "./RoomsTab";
import UsersTab from "./UsersTab";

const reducer = (state, payload) => {
    const { item, ...rest } = payload;
    if (item === null) {
        rest.userId = null;
        rest.roomId = null;
    } else if (item && item.userId) {
        rest.userId = item.userId;
    } else if (item && item.roomId) {
        rest.roomId = item.roomId;
    }
    return { ...state, ...rest };
};

export default () => {
    const { t } = useTranslation();

    const [{ tab, userId, roomId }, dispatch] = useReducer(reducer, {
        tab: "dashboard",
        userId: null,
        roomId: null,
    });

    const onSelect = tab => dispatch({ tab });

    return (
        <DispatchContext.Provider value={dispatch}>
            <Tabs id="tabs" activeKey={tab} {...{ onSelect }}>
                <Tab eventKey="dashboard" title={t("dashboardTab:title")}>
                    <DashboardTab />
                </Tab>
                <Tab eventKey="users" title={t("usersTab:title")}>
                    <UsersTab {...{ userId }} />
                </Tab>
                <Tab eventKey="rooms" title={t("roomsTab:title")}>
                    <RoomsTab {...{ roomId }} />
                </Tab>
                {/* not functional yet
                <Tab eventKey="monitoring" title={t("monitoringTab:title")}>
                    <MonitoringTab />
                </Tab>
                */}
            </Tabs>
        </DispatchContext.Provider>
    );
};
