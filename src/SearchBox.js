import React from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import "./css/SearchBox.scss";

export default ({ tableInstance, t }) => {
    const { state, setGlobalFilter } = tableInstance;

    const onChange = event => setGlobalFilter(event.target.value || undefined);

    const onClick = () => setGlobalFilter();

    return (
        <InputGroup className="searchBox">
            <InputGroup.Prepend>
                <InputGroup.Text>
                    <span role="img" aria-label={t("common:filter")}>
                        🔍
                    </span>
                </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
                className={state.globalFilter && "emptyFilter"}
                type="text"
                placeholder={t("searchBoxPlaceholder")}
                value={state.globalFilter || ""}
                {...{ onChange }}
            />
            {state.globalFilter && (
                <InputGroup.Append>
                    <InputGroup.Text className="clearButton">
                        <span role="img" aria-label={t("common:clear")} title={t("common:clear")} {...{ onClick }}>
                            ❌
                        </span>
                    </InputGroup.Text>
                </InputGroup.Append>
            )}
        </InputGroup>
    );
};
