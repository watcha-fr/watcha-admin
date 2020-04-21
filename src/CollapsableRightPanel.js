import React, { Component } from "react";

import CreateUserRightPanel from "./CreateUserRightPanel";
import RoomRightPanel from "./RoomRightPanel";
import UserRightPanel from "./UserRightPanel";

class CollapsableRightPanel extends Component {
    constructor(props) {
        super(props);
        this.state = { open: true };
    }

    getPanel() {
        let panel;
        switch (this.props.panelType) {
            case "user":
                panel = (
                    <UserRightPanel
                        data={this.props.data}
                        onClose={this.props.onClose}
                        lang={this.props.lang}
                        refresh={this.props.refresh}
                        changeTab={this.props.changeTab}
                        refreshRightPanel={this.props.refreshRightPanel}
                        update={this.props.update}
                    />
                );
                break;

            case "room":
                panel = (
                    <RoomRightPanel
                        data={this.props.data}
                        onClose={this.props.onClose}
                        refresh={this.props.refresh}
                        changeTab={this.props.changeTab}
                    />
                );
                break;

            case "createUser":
                panel = (
                    <CreateUserRightPanel
                        data={this.props.data}
                        onClose={this.props.onClose}
                        refresh={this.props.refresh}
                        refreshRightPanel={this.props.refreshRightPanel}
                        isEmailAvailable={this.props.isEmailAvailable}
                        changeTab={this.props.changeTab}
                    />
                );
                break;

            default:
                panel = (
                    <UserRightPanel
                        data={this.props.data}
                        onClose={this.props.onClose}
                        refresh={this.props.refresh}
                        lang={this.props.lang}
                    />
                );
        }
        return panel;
    }

    render() {
        return <div>{this.getPanel()}</div>;
    }
}

export default CollapsableRightPanel;
