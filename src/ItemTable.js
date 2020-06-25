import React, { useEffect, useRef } from "react";
import classNames from "classnames";
import Table from "react-bootstrap/Table";

import "./css/ItemTable.scss";

import { useDispatchContext } from "./contexts";

export default ({ tableInstance, itemId }) => {
    const dispatch = useDispatchContext();

    const getHeaderProps = column =>
        column.getHeaderProps(
            column.getSortByToggleProps({
                className: column.id,
                title: undefined,
            })
        );

    const getSortedChevron = column =>
        tableInstance.columns.includes(column) ? (
            <span
                className={classNames("chevron", {
                    "chevron-hidden": !column.isSorted,
                    "chevron-up": !column.isSortedDesc,
                })}
            />
        ) : null;

    const getRowProps = row => {
        const className =
            itemId && row.original.itemId === itemId
                ? "ItemTable_row-selected"
                : undefined;
        return row.getRowProps({ className });
    };

    const refs = useRef({});
    const { rows } = tableInstance;

    useEffect(() => {
        refs.current = rows.reduce((accumulator, row) => {
            accumulator[row.original.itemId] = React.createRef();
            return accumulator;
        }, {});
    }, [rows]);

    useEffect(() => {
        if (itemId) {
            refs.current[itemId].current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [itemId]);

    const {
        getTableProps,
        headerGroups,
        getTableBodyProps,
        prepareRow,
    } = tableInstance;

    return (
        <Table className="ItemTable" hover size="sm" {...getTableProps()}>
            <colgroup>
                {tableInstance.visibleColumns.map(column => (
                    <col key={column.id} className={column.id} />
                ))}
            </colgroup>

            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...getHeaderProps(column)}>
                                <span className="ItemTable_header">
                                    {column.render("Header")}
                                    {getSortedChevron(column)}
                                </span>
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>

            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);
                    const onClick = () => dispatch({ item: row.original });
                    return (
                        <tr
                            ref={refs.current[row.original.itemId]}
                            {...getRowProps(row)}
                        >
                            {row.cells.map(cell => (
                                <td {...cell.getCellProps({ onClick })}>
                                    {cell.render("Cell")}
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
};
