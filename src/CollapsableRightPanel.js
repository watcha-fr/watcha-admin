import React, { Component } from "react";
import RoomRightPanel from "./RoomRightPanel";
import UserRightPanel from "./UserRightPanel";
import CreateUserRightPanel from "./CreateUserRightPanel";

export default class CollapsableRightPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: true,
        };
    }

    onClose = () => {
        this.props.onClose();
    };

    getPanel = () => {
        let panel;
        switch (this.props.panelType) {
            case "user":
                panel = (
                    <UserRightPanel
                        data={this.props.data}
                        onClose={this.onClose}
                        server={this.props.server}
                        token={this.props.token}
                        lang={this.props.lang}
                        refresh={this.props.refresh}
                        onTabSelected={this.props.onTabSelected}
                        refreshRightPanel={this.props.refreshRightPanel}
                        update={this.props.update}
                    />
                );
                break;

            case "room":
                panel = (
                    <RoomRightPanel
                        data={this.props.data}
                        onClose={this.onClose}
                        server={this.props.server}
                        token={this.props.token}
                        refresh={this.props.refresh}
                        onTabSelected={this.props.onTabSelected}
                    />
                );
                break;

            case "createUser":
                panel = (
                    <CreateUserRightPanel
                        data={this.props.data}
                        onClose={this.onClose}
                        server={this.props.server}
                        token={this.props.token}
                        refresh={this.props.refresh}
                        isEmailAvailable={this.props.isEmailAvailable}
                        onTabSelected={this.props.onTabSelected}
                    />
                );
                break;

            default:
                panel = (
                    <UserRightPanel
                        data={this.props.data}
                        onClose={this.onClose}
                        server={this.props.server}
                        token={this.props.token}
                        refresh={this.props.refresh}
                        lang={this.props.lang}
                    />
                );
        }
        return panel;
    };
    render() {
        const PANEL = this.getPanel();

        return <div> {PANEL} </div>;
    }
}
