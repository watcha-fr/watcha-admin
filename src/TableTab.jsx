import React, { useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";

import { matchSorter } from "match-sorter";
import { useGet } from "restful-react";
import { useGlobalFilter, useSortBy, useTable } from "react-table";
import { withTranslation } from "react-i18next";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import { useDispatchContext } from "./contexts";
import DelayedSpinner from "./DelayedSpinner";
import SearchBox from "./SearchBox";
import ItemTable from "./ItemTable";

import "./css/TableTab.scss";

const TableTab = ({
    itemList,
    setItemList,
    requestParams,
    columns,
    initialState,
    plugins,
    newItemButton,
    newItemModal,
    itemId,
    ns,
}) => {
    const intervalIdRef = useRef();

    const { data, refetch } = useGet(requestParams);

    const refetchRef = useRef();
    refetchRef.current = refetch;

    useEffect(() => {
        refetchRef.current();
    }, []);

    useEffect(() => {
        setItemList(data);
        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
        }
        intervalIdRef.current = setInterval(() => {
            refetchRef.current();
        }, 10000);
    }, [data, setItemList]);

    const fuzzyTextFilterFn = (rows, ids, filterValue) =>
        matchSorter(rows, filterValue, {
            keys: [row => ids.map(id => row.values[id])],
        });

    const globalFilter = useMemo(() => fuzzyTextFilterFn, []);

    const tableInstance = useTable(
        {
            data: itemList || [],
            columns,
            initialState,
            globalFilter,
            autoResetGlobalFilter: false,
            autoResetSortBy: false,
            disableSortRemove: true,
        },
        useGlobalFilter,
        useSortBy,
        ...plugins
    );

    const dispatch = useDispatchContext();
    useEffect(() => {
        dispatch({ tableInstance });
    }, [tableInstance, dispatch]);

    const TransSearchBox = useMemo(() => withTranslation(ns)(SearchBox), [ns]);

    return itemList ? (
        <>
            <Container fluid>
                <Row className="d-flex justify-content-between p-3">
                    <TransSearchBox {...{ tableInstance }} />
                    {newItemButton}
                </Row>
            </Container>
            <div className="tableTabBody px-3">
                <ItemTable {...{ tableInstance, itemId }} />
            </div>
            {newItemModal}
        </>
    ) : (
        <DelayedSpinner />
    );
};

TableTab.defaultProps = {
    itemList: null,
    itemId: null,
    plugins: [],
    newItemButton: null,
    newItemModal: null,
};

TableTab.propTypes = {
    itemList: PropTypes.arrayOf(PropTypes.object),
    setItemList: PropTypes.func.isRequired,
    itemId: PropTypes.string,
    requestParams: PropTypes.shape({
        path: PropTypes.string.isRequired,
        lazy: PropTypes.bool.isRequired,
        resolve: PropTypes.func.isRequired,
    }).isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    initialState: PropTypes.shape({
        sortBy: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string,
                desc: PropTypes.bool,
            })
        ),
    }).isRequired,
    plugins: PropTypes.arrayOf(PropTypes.func),
    newItemButton: PropTypes.element,
    newItemModal: PropTypes.element,
    ns: PropTypes.string.isRequired,
};

export default TableTab;

export function compareLowerCase(rowA, rowB, columnId) {
    const a = rowA.values[columnId].toLowerCase();
    const b = rowB.values[columnId].toLowerCase();
    if (a === "") return 1;
    if (b === "") return -1;
    if (a === b) return 0;
    return a > b ? 1 : -1;
}
