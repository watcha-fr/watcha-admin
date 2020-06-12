import React from "react";

export default ({label, value}) => {
    return (
        <tr>
            <td className="informationRow_label">{label}</td>
            <td className="informationRow_value">{value}</td>
        </tr>
    );
};
