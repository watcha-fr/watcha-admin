import React from "react";
import { withTranslation } from "react-i18next";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

export default withTranslation()(({ tableInstance, t }) => {
    const { state, setGlobalFilter } = tableInstance;

    const onChange = event => setGlobalFilter(event.target.value || undefined);

    const onClick = () => setGlobalFilter();

    return (
        <InputGroup className="searchBox">
            <InputGroup.Prepend>
                <InputGroup.Text>
                    <span
                        role="img"
                        aria-label={t("usersTab.searchBox.filter")}
                    >
                        🔍
                    </span>
                </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
                className={state.globalFilter && "emptyFilter"}
                type="text"
                placeholder={t("usersTab.searchBox.placeholder")}
                value={state.globalFilter || ""}
                {...{ onChange }}
            />
            {state.globalFilter && (
                <InputGroup.Append>
                    <InputGroup.Text className="clearButton">
                        <span
                            role="img"
                            aria-label={t("usersTab.searchBox.reset")}
                            {...{ onClick }}
                        >
                            ❌
                        </span>
                    </InputGroup.Text>
                </InputGroup.Append>
            )}
        </InputGroup>
    );
});
