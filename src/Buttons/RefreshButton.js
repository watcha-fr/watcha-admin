import React, { Component } from "react";
import { Button } from "react-bootstrap";

export default class RefreshButton extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    onClick = () => {
        this.props.onClick();
    };

    render() {
        return (
            <Button
                onClick={this.onClick}
                variant={this.props.variant}
                bsSize="small"
                className="refreshButton"
            >
                <i className="fas fa-sync-alt"></i>
            </Button>
        );
    }
}
