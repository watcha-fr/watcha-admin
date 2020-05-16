import React from "react";
import { useTranslation } from "react-i18next";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

export default ({ ns, tableInstance }) => {
    const { t } = useTranslation(ns);

    const { state, setGlobalFilter } = tableInstance;

    const onChange = event => setGlobalFilter(event.target.value || undefined);

    const onClick = () => setGlobalFilter();

    return (
        <InputGroup className="searchBox">
            <InputGroup.Prepend>
                <InputGroup.Text>
                    <span
                        role="img"
                        aria-label={t("searchBox.filter")}
                    >
                        🔍
                    </span>
                </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
                className={state.globalFilter && "emptyFilter"}
                type="text"
                placeholder={t("searchBox.placeholder")}
                value={state.globalFilter || ""}
                {...{ onChange }}
            />
            {state.globalFilter && (
                <InputGroup.Append>
                    <InputGroup.Text className="clearButton">
                        <span
                            role="img"
                            aria-label={t("searchBox.clear")}
                            {...{ onClick }}
                        >
                            ❌
                        </span>
                    </InputGroup.Text>
                </InputGroup.Append>
            )}
        </InputGroup>
    );
};
