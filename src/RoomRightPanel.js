import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { withTranslation } from "react-i18next";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Collapse from "react-bootstrap/Collapse";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import Table from "react-bootstrap/Table";

import { DispatchContext } from "./contexts";
import UserInRoom from "./UserInRoom";

class RoomRightPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
            editEmail: false,
            isEmail: false,
            emailValue: "",
        };
    }

    static contextType = DispatchContext;

    onUserClicked = userId => {
        const dispatch = this.context;
        dispatch({ tab: "users", userId });
    };

    simplifiedUserId = fulluserId => {
        let simplifiedUserId = fulluserId.replace("@", "");
        simplifiedUserId = simplifiedUserId.split(":");
        simplifiedUserId = simplifiedUserId[0];
        return simplifiedUserId;
    };

    render() {
        const { t } = this.props;
        const TITLE = "Room";
        const OPEN = this.props.data ? true : false;
        const users = [];
        for (const user in this.props.data["Users"]["simplifiedData"]) {
            if (
                {}.hasOwnProperty.call(
                    this.props.data["Users"]["simplifiedData"],
                    user
                )
            ) {
                users.push(
                    <ListGroupItem key={user}>
                        <UserInRoom
                            simplifiedName={this.simplifiedUserId(
                                this.props.data["Users"]["simplifiedData"][user]
                            )}
                            onUserClicked={this.onUserClicked}
                            userName={
                                this.props.data["Users"]["simplifiedData"][user]
                            }
                        />
                    </ListGroupItem>
                );
            }
        }

        return (
            <div>
                <Collapse in={OPEN} dimension="width" timeout={0}>
                    <div>
                        <Card className="rightPanel">
                            <Card.Header className="header-with-button">
                                {t(TITLE) +
                                    " : " +
                                    this.props.data["Room Id"][
                                        "simplifiedData"
                                    ]}
                                <FontAwesomeIcon
                                    className="dismissRight"
                                    icon={faTimes}
                                    onClick={this.props.onClose}
                                />
                            </Card.Header>

                            <div className="pannelContainer">
                                <Card.Body>
                                    <Card body bg="light">
                                        <Table>
                                            <tbody>
                                                <tr>
                                                    <td className="labelText">
                                                        {t("Name")}:
                                                    </td>
                                                    <td className="infoText">
                                                        {
                                                            this.props.data[
                                                                "Name"
                                                            ]["simplifiedData"]
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="labelText">
                                                        {t("Creator")}:
                                                    </td>
                                                    <td className="infoText">
                                                        {
                                                            this.props.data[
                                                                "Creator"
                                                            ]["simplifiedData"]
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="labelText">
                                                        {t("Active")}:
                                                    </td>
                                                    <td className="infoText">
                                                        {this.props.data[
                                                            "Active"
                                                        ][
                                                            "simplifiedData"
                                                        ].toString()}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                        {this.props.data.Users.simplifiedData
                                            .length > 0 && (
                                            <Accordion>
                                                <Card id="collapsible-panel-users">
                                                    <Card.Header>
                                                        {this.props.data.Users
                                                            .simplifiedData
                                                            .length +
                                                            " " +
                                                            t(
                                                                "Users in this room"
                                                            )}
                                                        <Accordion.Toggle
                                                            as={Button}
                                                            variant="link"
                                                            eventKey="0"
                                                        >
                                                            {t("Show users")}
                                                        </Accordion.Toggle>
                                                    </Card.Header>
                                                    <Accordion.Collapse eventKey="0">
                                                        <Card.Body>
                                                            <ListGroup>
                                                                {users}
                                                            </ListGroup>
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>
                                            </Accordion>
                                        )}
                                    </Card>
                                </Card.Body>
                            </div>
                        </Card>
                    </div>
                </Collapse>
            </div>
        );
    }
}

export default withTranslation()(RoomRightPanel);
