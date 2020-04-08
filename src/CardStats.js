import React, { Component } from "react";
import { Panel } from "react-bootstrap";
import { withNamespaces } from "react-i18next";
import AdminCardStats from "./AdminCardStats";

class CardStats extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    onCardClicked = () => {
        const { t } = this.props;
        if (this.props.title === t("Users")) {
            this.props.onTabSelected(2, false);
        } else if (this.props.title === t("Rooms")) {
            this.props.onTabSelected(3, false);
        }
    };

    onUserClicked = username => {
        this.props.onTabSelected(2, username);
    };

    getPanelContent = () => {
        const { t } = this.props;
        const panelContent = [];
        for (const LINE in this.props.lines) {
            if ({}.hasOwnProperty.call(this.props.lines, LINE)) {
                if (this.props.lines[LINE].label === t("Admin")) {
                    const admins = [];
                    for (const data in this.props.lines[LINE].data) {
                        if (this.props.lines[LINE].data.hasOwnProperty(data)) {
                            admins.push(
                                <div
                                    key={this.props.lines[LINE].data[data]}
                                    adminname={
                                        this.props.lines[LINE].data[data]
                                    }
                                >
                                    <AdminCardStats
                                        simplifiedname={this.simplifiedUserId(
                                            this.props.lines[LINE].data[data]
                                        )}
                                        onUserClicked={this.onUserClicked}
                                        adminName={
                                            this.props.lines[LINE].data[data]
                                        }
                                    />
                                </div>
                            );
                        }
                    }
                    panelContent.push(
                        <div key={this.props.lines[LINE].label}>
                            {" "}
                            {t("Administrators")}: {admins}{" "}
                        </div>
                    );
                } else {
                    panelContent.push(
                        <div key={this.props.lines[LINE].label}>
                            {this.props.lines[LINE].label +
                                ": " +
                                this.props.lines[LINE].data}
                        </div>
                    );
                }
            }
        }
        return panelContent;
    };

    simplifiedUserId = fulluserId => {
        let simplifiedUserId = fulluserId[0].replace("@", "");
        simplifiedUserId = simplifiedUserId.split(":");
        simplifiedUserId = simplifiedUserId[0];
        return simplifiedUserId;
    };

    render() {
        const PANEL_CONTENT = this.getPanelContent();
        return (
            <Panel bsStyle="primary" className="statsPanel">
                <Panel.Heading>
                    <Panel.Title
                        componentClass="h3"
                        onClick={this.onCardClicked}
                        className="StatsTitle"
                    >
                        {" "}
                        {this.props.title}{" "}
                    </Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                    <div className="statsPanelContent">
                        <div>{PANEL_CONTENT}</div>
                    </div>
                </Panel.Body>
            </Panel>
        );
    }
}

export default withNamespaces("common")(CardStats);
