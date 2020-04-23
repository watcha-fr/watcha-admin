import React from "react";

import DataToTable from "./DataToTable";

export default ({ userId }) => <DataToTable tableName="user" {...{ userId }} />;
