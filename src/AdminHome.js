import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import DataToTable from "./DataToTable";
// import Monitoring from './Monitoring';
import StatsTab from "./StatsTab";

class AdminHome extends Component {
    constructor() {
        super();
        this.state = {
            refresh: true,
            key: 1,
        };
    }

    onClose = () => this.setState({ rightPanel: false });

    onTabSelected = (tabKey, data) => {
        this.setState({
            key: tabKey,
            data,
        });
    };

    handleSelect = key => this.setState({ key });

    render() {
        const KEY = this.state.key ? this.state.key : 1;
        const SELECTED = this.state.data ? this.state.data : false;
        const { t } = this.props;
        const STATSTAB = <StatsTab onTabSelected={this.onTabSelected} />;

        return (
            <Tabs
                activeKey={KEY}
                className="tabsContainer"
                id="tabs"
                onSelect={this.handleSelect}
            >
                <Tab eventKey={1} title={t("Overview")}>
                    {STATSTAB}
                </Tab>
                <Tab eventKey={2} title={t("Users")}>
                    <DataToTable
                        tableName="user"
                        setRightPanel={this.setRightPanel}
                        onClose={this.onClose}
                        value={SELECTED}
                        onTabSelected={this.onTabSelected}
                    />
                </Tab>
                <Tab eventKey={3} title={t("Rooms")}>
                    <DataToTable
                        tableName="room"
                        setRightPanel={this.setRightPanel}
                        onClose={this.onClose}
                        stats={this.state.statsData}
                        value={SELECTED}
                        onTabSelected={this.onTabSelected}
                    />
                </Tab>
                {/* not functional yet
                    <Tab eventKey={4} title={t("Monitoring")}>
                        <Monitoring onTabSelected={this.onTabSelected} />
                    </Tab> */}
            </Tabs>
        );
    }
}

export default withTranslation()(AdminHome);
