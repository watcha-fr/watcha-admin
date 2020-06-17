import React, { useState } from "react";
import ExpandButton from "./ExpandButton";
import Tooltip from "./Tooltip";
import { useDispatchContext } from "./contexts";

export default ({ label, value, administratorList, tooltipName }) => {
    const administratorsSection = [];

    if (administratorList) {
        for (const index in administratorList) {
            const adminUser = administratorList[index];
            administratorsSection.push(
                <tr key={adminUser.user_id}>
                    <td
                        className="panelRow_adminUserRow"
                        onClick={() => onAdminUserClick(adminUser.user_id)}
                    >
                        {`${
                            adminUser.displayname
                                ? adminUser.displayname
                                : adminUser.user_id
                                      .replace("@", "")
                                      .split(":")[0]
                        } ${adminUser.email ? `(${adminUser.email})` : ""}`}
                    </td>
                </tr>
            );
        }
    }

    const [isExpanded, setIsExpand] = useState(false);

    const onExpandButtonClick = () => {
        isExpanded ? setIsExpand(false) : setIsExpand(true);
    };

    const dispatch = useDispatchContext();

    const onAdminUserClick = userId => dispatch({ tab: "users", userId });

    return (
        <tr>
            <td className="panelRow_label">{label}</td>
            {tooltipName && <Tooltip {...{ tooltipName }} />}
            {administratorList && (
                <ExpandButton onClick={onExpandButtonClick} />
            )}
            <td className="panelRow_value">{value}</td>
            {isExpanded && (
                <div className="panelRow_administratorsSection">
                    {administratorsSection}
                </div>
            )}
        </tr>
    );
};
