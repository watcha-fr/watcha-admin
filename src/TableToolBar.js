import React, { Component } from "react";
import { withTranslation } from "react-i18next";

import RefreshButton from "./Buttons/RefreshButton";

class TableToolBar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    createUser = () => {
        const PANEL = { type: "createUser" };
        this.props.setRightPanel(PANEL);
    };

    render() {
        const { t } = this.props;
        return (
            <div className="TableToolBar">
                <div className="filtersOption">
                    <RefreshButton
                        onClick={this.props.refresh}
                        variant="primary"
                    />
                    <div className="checkboxfilter">
                        <label>{t("One-to-one conversations")}</label>
                        <input
                            type="checkbox"
                            name={"hideOneToOne"}
                            checked={this.props.hideOneToOne}
                            onChange={this.props.handleFilter}
                        />
                    </div>
                    <div className="checkboxfilter">
                        <label>{t("Inactive")}</label>
                        <input
                            type="checkbox"
                            name={"hideInactive"}
                            checked={this.props.hideInactive}
                            onChange={this.props.handleFilter}
                        />
                    </div>
                    <div className="textFilter">
                        <input
                            type="text"
                            name="textFilter"
                            placeholder={t("Search")}
                            onChange={this.props.handleFilter}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation()(TableToolBar);
