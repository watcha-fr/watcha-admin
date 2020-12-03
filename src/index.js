import React from "react";
import ReactDOM from "react-dom";

import ErrorBoundary from "./ErrorBoundary";
import App from "./App";

import "./i18n";
import "./css/index.css";

ReactDOM.render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>,
    document.getElementById("root")
);
