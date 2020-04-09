import React, { Component } from "react";
import { withNamespaces } from "react-i18next";

class AdminCardStats extends Component {
    onUserClicked = () => {
        this.props.onUserClicked(this.props.adminName[[0]]);
    };
    render() {
        return (
            <div className="AdminName" onClick={this.onUserClicked}>
                {this.props.simplifiedname}
            </div>
        );
    }
}
export default withNamespaces("common")(AdminCardStats);
