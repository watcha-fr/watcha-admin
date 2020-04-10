import React, { Component } from "react";
import {
    Accordion,
    Collapse,
    Card,
    Button,
    Well,
    Table,
    ListGroupItem,
    ListGroup,
} from "react-bootstrap";
import { withNamespaces } from "react-i18next";
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

    onClose = () => {
        this.props.onClose();
    };

    onUserClicked = userName => {
        this.props.onTabSelected(2, userName);
    };

    simplifiedUserId = fulluserId => {
        let simplifiedUserId = fulluserId.replace("@", "");
        simplifiedUserId = simplifiedUserId.split(":");
        simplifiedUserId = simplifiedUserId[0];
        return simplifiedUserId;
    };

    render() {
        const { t } = this.props;
        const BSSTYLE = "primary";
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
                        <Card bsStyle={BSSTYLE} className="rightPanel">
                            <Card.Header>
                                <Card.Title componentClass="h3">
                                    {t(TITLE)}:{" "}
                                    {
                                        this.props.data["Room Id"][
                                            "simplifiedData"
                                        ]
                                    }
                                    <i
                                        className="fas fa-times dismissRight"
                                        onClick={this.onClose}
                                    ></i>
                                </Card.Title>
                            </Card.Header>

                            <div className="pannelContainer">
                                <Well>
                                    <Table>
                                        <tbody>
                                            <tr>
                                                <td className="labelText">
                                                    {t("Name")}:
                                                </td>
                                                <td className="infoText">
                                                    {
                                                        this.props.data["Name"][
                                                            "simplifiedData"
                                                        ]
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
                                                    {this.props.data["Active"][
                                                        "simplifiedData"
                                                    ].toString()}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Well>
                                <Accordion>
                                    <Card id="collapsible-panel-users">
                                        <Card.Header>
                                            <Card.Title>
                                                {
                                                    this.props.data["Users"][
                                                        "simplifiedData"
                                                    ].length
                                                }{" "}
                                                {t("Users in this room")}
                                            </Card.Title>
                                            {this.props.data["Users"][
                                                "simplifiedData"
                                            ].length > 0 && (
                                                <Accordion.Toggle
                                                    as={Button}
                                                    variant="link"
                                                    eventKey="0"
                                                >
                                                    {t("Show users")}
                                                </Accordion.Toggle>
                                            )}
                                        </Card.Header>
                                        <Accordion.Collapse>
                                            <Card.Body>
                                                <ListGroup>{users}</ListGroup>
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion>
                            </div>
                        </Card>
                    </div>
                </Collapse>
            </div>
        );
    }
}

export default withNamespaces("common")(RoomRightPanel);
