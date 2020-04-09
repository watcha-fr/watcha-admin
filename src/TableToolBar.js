import React, { Component } from "react";
import RefreshButton from "./Buttons/RefreshButton";
import CreateUserButton from "./Buttons/CreateUserButton";
import { withNamespaces } from "react-i18next";
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
                            bsStyle="primary"
                        />
                        <CreateUserButton
                            onClick={this.createUser}
                            bsStyle="success"
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
                        bsStyle="primary"
                    />
                    <div className="checkboxfilter">
                        <label>{t("One-to-one conversations")}</label>
                        <input
                            type="checkbox"
                            name={t("hideOneToOne")}
                            checked={this.props.hideOneToOne}
                            onChange={this.props.handleFilter}
                        />
                    </div>
                    <div className="checkboxfilter">
                        <label>{t("Inactive")}</label>
                        <input
                            type="checkbox"
                            name={t("hideInactive")}
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

export default withNamespaces("common")(TableToolBar);
