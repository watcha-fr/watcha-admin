import React, { Component } from "react";
import Card from "react-bootstrap/Card";

class Monitoring extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.getLogs();
        this.getServerState();
    }

    getLogs = async () => {
        let logData;
        const HOME_SERVER = this.props.server;
        const ACCESS_TOKEN = this.props.token;

        try {
            const LOG_REQUEST = await fetch(
                new URL("_matrix/client/r0/watcha_log", HOME_SERVER),
                {
                    method: "GET",
                    headers: {
                        Authorization: "Bearer " + ACCESS_TOKEN,
                    },
                }
            );

            logData = JSON.parse(await LOG_REQUEST.text());
        } catch (e) {
            console.log("error: " + e);
            return;
        }
        this.setState({ log: logData });
        this.displayLogs();
    };

    getServerState = async () => {
        let serverReport;
        const HOME_SERVER = this.props.server;
        const ACCESS_TOKEN = this.props.token;

        try {
            const SERVER_REPORT_REQUET = await fetch(
                new URL("_matrix/client/r0/watcha_server_state", HOME_SERVER),
                {
                    method: "GET",
                    headers: {
                        Authorization: "Bearer " + ACCESS_TOKEN,
                    },
                }
            );

            serverReport = JSON.parse(await SERVER_REPORT_REQUET.text());
        } catch (e) {
            console.log("error: " + e);
            return;
        }
        this.setState({ serverReport });
    };

    displayLogs = () => {
        const list = [];
        const LOG = this.state.log;
        let i;
        for (i = 0; i < 10000 && i < LOG.length; i++) {
            if (LOG[i]["type"] === " INFO ") {
                list.push(
                    <div className="Log" key={i}>
                        {LOG[i]["date"] +
                            " " +
                            LOG[i]["type"] +
                            " " +
                            LOG[i]["text"]}
                    </div>
                );
            } else if (LOG[i]["type"] === " ERROR ") {
                list.push(
                    <div className="Error" key={i}>
                        {LOG[i]["date"] + " " + LOG[i]["text"]}
                    </div>
                );
            } else if (LOG[i]["type"] === " WARNING ") {
                list.push(
                    <div className="Warning" key={i}>
                        {LOG[i]["date"] + " " + LOG[i]["text"]}{" "}
                    </div>
                );
            }
        }
        this.setState({ list });
    };

    render() {
        return (
            <Card body bg="light">
                {this.state.list}
            </Card>
        );
    }
}

export default Monitoring;
