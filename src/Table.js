import React, { useEffect, useRef } from "react";
import classNames from "classnames";
import Table from "react-bootstrap/Table";

import { useDispatchContext } from "./contexts";

export default ({ tableInstance, itemId }) => {
    const dispatch = useDispatchContext();

    const getHeaderProps = column =>
        column.getHeaderProps(
            column.getSortByToggleProps({ title: undefined })
        );

    const getSortedChevron = column => (
        <span
            className={classNames("chevron", {
                chevronHidden: !column.isSorted,
                chevronUp: !column.isSortedDesc,
            })}
        />
    );

    const getRowProps = row => {
        const className =
            itemId && row.original.itemId === itemId
                ? "selectedRow"
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
        <Table hover size="sm" {...getTableProps()}>
            <colgroup>
                {tableInstance.columns.map(column => (
                    <col key={column.id} className={column.id} />
                ))}
            </colgroup>

            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...getHeaderProps(column)}>
                                <span className="tableHeader">
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
