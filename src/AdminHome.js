import React, { useReducer } from "react";
import { useTranslation } from "react-i18next";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { DispatchContext } from "./contexts";
import reducer from "./reducer";
import DashboardTab from "./DashboardTab";
// import MonitoringTab from './MonitoringTab';
import RoomsTab from "./RoomsTab";
import UsersTab from "./UsersTab";

import "./css/AdminHome.scss"

export default () => {
    const { t } = useTranslation();

    const [{ tab, userId }, dispatch] = useReducer(reducer, {
        tab: "dashboard",
        userId: null,
    });

    const onSelect = tab => dispatch({ tab });

    return (
        <DispatchContext.Provider value={dispatch}>
            <Tabs id="AdminHome_tabs" activeKey={tab} {...{ onSelect }}>
                <Tab eventKey="dashboard" title={t("dashboardTab:title")}>
                    <DashboardTab />
                </Tab>
                <Tab eventKey="users" title={t("usersTab:title")}>
                    <UsersTab {...{ userId }} />
                </Tab>
                <Tab eventKey="rooms" title={t("roomsTab:title")}>
                    <RoomsTab />
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
