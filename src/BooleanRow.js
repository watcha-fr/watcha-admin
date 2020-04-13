import React, { Component } from "react";

export default class BooleanRow extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        let row;
        if (this.props.selected !== "rowSelected") {
            if (this.props.value) {
                row = <i className="fas fa-check trueBoolean"></i>;
            } else {
                row = <i className="fas fa-times falseBoolean"></i>;
            }
        } else {
            if (this.props.value) {
                row = <i className="fas fa-check"></i>;
            } else {
                row = <i className="fas fa-times"></i>;
            }
        }

        return <span>{row}</span>;
    }
}
