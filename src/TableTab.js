import React, { useMemo } from "react";
import {
    useGlobalFilter,
    useRowSelect,
    useSortBy,
    useTable,
} from "react-table";
import matchSorter from "match-sorter";

import SearchBox from "./SearchBox";
import Table from "./Table";

export default ({
    ns,
    data,
    columns,
    initialState,
    button,
    rightPanel,
    editUser,
    newItemModal
}) => {
    const globalFilter = useMemo(() => fuzzyTextFilterFn, []);

    const tableInstance = useTable(
        {
            data,
            columns,
            initialState,
            globalFilter,
            autoResetGlobalFilter: false,
            autoResetSortBy: false,
            autoResetSelectedRows: false,
            disableSortRemove: true,
        },
        useGlobalFilter,
        useSortBy,
        useRowSelect
    );

    return (
        <>
            <div className="d-flex justify-content-between p-3">
                <SearchBox {...{ ns, tableInstance }} />
                {button}
            </div>
            <div className="tableTabBody">
                <div className="tableContainer px-3">
                    <Table {...{ tableInstance, editUser }} />
                </div>
                {rightPanel}
            </div>
            {newItemModal}
        </>
    );
};

const fuzzyTextFilterFn = (rows, ids, filterValue) =>
    matchSorter(rows, filterValue, {
        keys: [row => ids.map(id => row.values[id])],
    });

export function compareLowerCase(rowA, rowB, columnId) {
    const a = rowA.values[columnId].toLowerCase();
    const b = rowB.values[columnId].toLowerCase();
    return a === b ? 0 : a > b ? 1 : -1;
}
