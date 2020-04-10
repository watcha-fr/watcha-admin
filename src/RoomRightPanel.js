import React, { Component } from "react";
import {
    Accordion,
    Collapse,
    Card,
    Button,
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
                        <Card className="rightPanel" bg="light">
                            <Card.Header className="header-with-button">
                                {t(TITLE) +
                                    " : " +
                                    this.props.data["Room Id"][
                                        "simplifiedData"
                                    ]}
                                <i
                                    className="fas fa-times dismissRight"
                                    onClick={this.onClose}
                                ></i>
                            </Card.Header>

                            <div className="pannelContainer">
                                <Card.Body>
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
                                </Card.Body>
                                <Accordion>
                                    <Card id="collapsible-panel-users">
                                        <Card.Header>
                                            {this.props.data["Users"][
                                                "simplifiedData"
                                            ].length +
                                                " " +
                                                t("Users in this room")}
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
                                        <Accordion.Collapse eventKey="0">
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
