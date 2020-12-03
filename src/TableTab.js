import React, { useEffect, useMemo, useRef } from "react";
import { useGet } from "restful-react";
import { useGlobalFilter, useSortBy, useTable } from "react-table";
import { withTranslation } from "react-i18next";
import matchSorter from "match-sorter";

import { useDispatchContext } from "./contexts";
import DelayedSpinner from "./DelayedSpinner";
import SearchBox from "./SearchBox";
import ItemTable from "./ItemTable";

import "./css/TableTab.scss";

export default ({
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
        intervalIdRef.current = setInterval(() => refetchRef.current(), 10000);
    }, [data, setItemList]);

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
        ...(plugins || [])
    );

    const dispatch = useDispatchContext();
    useEffect(() => dispatch({ tableInstance }), [tableInstance, dispatch]);

    const TransSearchBox = useMemo(() => withTranslation(ns)(SearchBox), [ns]);

    return itemList ? (
        <>
            <div className="d-flex justify-content-between p-3">
                <TransSearchBox {...{ tableInstance }} />
                {newItemButton}
            </div>
            <div className="tableTabBody px-3">
                <ItemTable {...{ tableInstance, itemId }} />
            </div>
            {newItemModal}
        </>
    ) : (
        <DelayedSpinner />
    );
};

const fuzzyTextFilterFn = (rows, ids, filterValue) =>
    matchSorter(rows, filterValue, {
        keys: [row => ids.map(id => row.values[id])],
    });

export function compareLowerCase(rowA, rowB, columnId) {
    const a = rowA.values[columnId].toLowerCase();
    const b = rowB.values[columnId].toLowerCase();
    if (a === "") return 1;
    if (b === "") return -1;
    return a === b ? 0 : a > b ? 1 : -1;
}
