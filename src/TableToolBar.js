import React, { Component } from "react";
import { withTranslation } from "react-i18next";

import CreateUserButton from "./NewUserButton";
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
        let filtersOption;
        if (this.props.tab === "user") {
            filtersOption = (
                <div className="filtersOption">
                    <div className="buttonsGroup">
                        <RefreshButton
                            onClick={this.props.refresh}
                            variant="primary"
                        />
                        <CreateUserButton
                            onClick={this.createUser}
                            variant="success"
                        />
                    </div>
                    <div className="checkboxfilter">
                        <label>{t("Internal users")}</label>
                        <input
                            type="checkbox"
                            name="hideMembers"
                            checked={this.props.hideMembers}
                            onChange={this.props.handleFilter}
                        />
                    </div>
                    <div className="checkboxfilter">
                        <label>{t("Partners")}</label>
                        <input
                            type="checkbox"
                            name="hidePartners"
                            checked={this.props.hidePartners}
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
            );
        }
        if (this.props.tab === "room") {
            filtersOption = (
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
            );
        }
        return <div className="TableToolBar">{filtersOption}</div>;
    }
}

export default withTranslation()(TableToolBar);
