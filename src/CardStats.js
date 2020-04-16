import React, { Component } from "react";
import { Card } from "react-bootstrap";
import { withTranslation } from "react-i18next";
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
            <Card className="statsPanel">
                <Card.Header>
                    <span className="StatsTitle" onClick={this.onCardClicked}>
                        {this.props.title}
                    </span>
                </Card.Header>
                <Card.Body>
                    <div className="statsPanelContent">
                        <div>{PANEL_CONTENT}</div>
                    </div>
                </Card.Body>
            </Card>
        );
    }
}

export default withTranslation()(CardStats);
