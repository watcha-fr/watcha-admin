import React from "react";

import "./css/Status.scss";

export default ({ status, t }) => <span className={`Status ${status}`} title={t(`status.${status}`)} />;
