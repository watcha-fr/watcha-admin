import React, { Component } from "react";
import { Glyphicon } from "react-bootstrap";

export default class BooleanRow extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        let row;
        if (this.props.selected !== "rowSelected") {
            if (this.props.value) {
                row = <Glyphicon glyph="ok" className="trueBoolean" />;
            } else {
                row = <Glyphicon glyph="remove" className="falseBoolean" />;
            }
        } else {
            if (this.props.value) {
                row = <Glyphicon glyph="ok" />;
            } else {
                row = <Glyphicon glyph="remove" />;
            }
        }

        return <span>{row}</span>;
    }
}
