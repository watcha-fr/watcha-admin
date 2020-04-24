import React, { useReducer } from "react";
import { withTranslation } from "react-i18next";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { DispatchContext, RoomIdContext, UserIdContext } from "./contexts";
import DashboardTab from "./DashboardTab";
// import MonitoringTab from './MonitoringTab';
import RoomsTab from "./RoomsTab";
import UsersTab from "./UsersTab";

const reducer = (state, payload) => ({ ...state, ...payload });

export default withTranslation()(({ t }) => {
    const [{ tab, userId, roomId }, dispatch] = useReducer(reducer, {
        tab: "dashboard",
        userId: null,
        roomId: null,
    });

    const onSelect = tab => dispatch({ tab });

    return (
        <DispatchContext.Provider value={dispatch}>
            <UserIdContext.Provider value={userId}>
                <RoomIdContext.Provider value={roomId}>
                    <Tabs id="tabs" activeKey={tab} {...{ onSelect }}>
                        <Tab
                            eventKey="dashboard"
                            title={t("dashboardTab.title")}
                        >
                            <DashboardTab />
                        </Tab>
                        <Tab eventKey="users" title={t("usersTab.title")}>
                            <UsersTab />
                        </Tab>
                        <Tab eventKey="rooms" title={t("roomsTab.title")}>
                            <RoomsTab />
                        </Tab>
                        {/* not functional yet
                        <Tab
                            eventKey="monitoring"
                            title={t("monitoringTab.title")}
                        >
                            <MonitoringTab />
                        </Tab> */}
                    </Tabs>
                </RoomIdContext.Provider>
            </UserIdContext.Provider>
        </DispatchContext.Provider>
    );
});
