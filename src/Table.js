import React, { useEffect } from "react";
import classNames from "classnames";
import Table from "react-bootstrap/Table";

export default ({ tableInstance, editUser }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance;

    useEffect(() => {
        const row = tableInstance.selectedFlatRows[0];
        if (row) {
            editUser(row.original);
        }
    }, [tableInstance.selectedFlatRows, editUser]);

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

    const getRowProps = row =>
        row.getRowProps({ className: row.isSelected && "selectedRow" });

    const selectRow = row => {
        const isNotSelected = !row.isSelected;
        tableInstance.toggleAllRowsSelected(false);
        if (isNotSelected) {
            row.toggleRowSelected(true);
            editUser(row.original);
        } else {
            editUser();
        }
    };

    const onBlur = () => tableInstance.toggleAllRowsSelected(false);

    return (
        <Table hover size="sm" {...getTableProps({ onBlur, tabIndex: "0" })}>
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
                    const onClick = () => selectRow(row);
                    return (
                        <tr {...getRowProps(row)}>
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