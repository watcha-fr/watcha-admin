import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { withTranslation } from "react-i18next";
class CreateUserButton extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <Button onClick={this.props.onClick} variant={this.props.variant}>
                {this.props.t("Create user")}
            </Button>
        );
    }
}
export default withTranslation()(CreateUserButton);
