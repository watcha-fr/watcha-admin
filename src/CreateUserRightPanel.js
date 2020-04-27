import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Collapse from "react-bootstrap/Collapse";
import Table from "react-bootstrap/Table";

import { MatrixClientContext } from "./contexts";

class CreateUserRightPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            infoMessage: false,
            editUserId: false,
            emailValue: " ",
            lastNameValue: "",
            firstNameValue: "",
            suggestedUserId: "",
            userIdValue: "",
            busy: false,
        };
    }

    static contextType = MatrixClientContext;

    onEmailChange = ev => {
        this.setState({
            emailValue: ev.target.value,
            isEmail: this.isEmail(ev.target.value),
        });
    };

    onFirstNameChange = ev => {
        const FIRST_NAME = ev.target.value;
        this.setState({
            firstNameValue: FIRST_NAME,
            isFirstName: this.isName(FIRST_NAME),
        });
        this.generateSuggestedUserId(FIRST_NAME, true);
    };

    onLastNameChange = ev => {
        const NAME = ev.target.value;
        this.setState({
            lastNameValue: NAME,
            isLastName: this.isName(NAME),
        });
        this.generateSuggestedUserId(NAME, false);
    };

    onUserIdChange = ev => this.setState({ userIdValue: ev.target.value });

    onUserIdEdit = () => this.setState({ editUserId: !this.state.editUserId });

    createUser = async () => {
        const client = this.context;
        const { t } = this.props;
        if (!this.state.isEmail) {
            this.setState({
                message: {
                    type: "danger",
                    title: t("Invalid Email"),
                    body: t(
                        "This email address seems to be invalid. Please enter a valid email address."
                    ),
                },
            });
            this.displayInfoMessage();
        } else if (!this.state.isFirstName) {
            this.setState({
                message: {
                    type: "danger",
                    title: t("Invalid First Name"),
                    body: t("First Name must contain at least two characters "),
                },
            });
            this.displayInfoMessage();
        } else if (!this.state.isLastName) {
            this.setState({
                message: {
                    type: "danger",
                    title: t("Invalid Last Name"),
                    body: t("Last Name must contain at least two characters "),
                },
            });
            this.displayInfoMessage();
        } else if (!this.props.isEmailAvailable(this.state.emailValue)) {
            this.setState({
                message: {
                    type: "danger",
                    title: t("Email already in use"),
                    body:
                        this.state.emailValue +
                        t(" is already in use for a different account."),
                },
            });
            this.displayInfoMessage();
        } else if (!this.state.userIdValue && !this.state.suggestedUserId) {
            this.setState({
                message: {
                    type: "danger",
                    title: t("User id required"),
                    body: t("Enter a valid user id"),
                },
            });
            this.displayInfoMessage();
        } else {
            try {
                this.setState({
                    busy: true,
                });
                const USER_ID = this.state.userIdValue
                    ? this.state.userIdValue
                    : this.state.suggestedUserId;
                const USER_REQUEST = await fetch(
                    new URL(
                        "_matrix/client/r0/watcha_register",
                        client.baseUrl
                    ),
                    {
                        method: "POST",
                        headers: {
                            Authorization: "Bearer " + client.getAccessToken(),
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            user: USER_ID,
                            full_name:
                                this.state.firstNameValue +
                                " " +
                                this.state.lastNameValue,
                            email: this.state.emailValue,
                            admin: false,
                        }),
                    }
                );
                const RESPONSE = JSON.parse(await USER_REQUEST.text());
                if (USER_REQUEST.ok) {
                    this.setState({
                        message: {
                            type: "success",
                            title: t("User Created"),
                            body: USER_ID + t(" has been added to Watcha"),
                        },
                        busy: false,
                        clearForm: true,
                    });
                    this.displayInfoMessage();
                } else {
                    this.setState({
                        message: {
                            type: "danger",
                            title: t("User Creation Failed"),
                            body: RESPONSE["error"],
                        },
                        busy: false,
                    });
                    this.displayInfoMessage();
                }
            } catch (e) {
                console.log("error: " + e);
                this.setState({
                    busy: false,
                });
                return;
            }
        }
    };

    dismissInfoMessage = () => {
        this.setState({ infoMessage: false });
        if (this.state.clearForm) {
            this.setState({
                clearForm: false,
                emailValue: "",
                userIdValue: "",
                lastNameValue: "",
                firstNameValue: "",
            });
        }
    };

    displayInfoMessage = () => this.setState({ infoMessage: true });

    generateSuggestedUserId = (value, firstName) => {
        const suggestedUserId = firstName
            ? value.toLowerCase() + "." + this.state.lastNameValue.toLowerCase()
            : this.state.firstNameValue.toLocaleLowerCase() +
              "." +
              value.toLowerCase();
        this.setState({ suggestedUserId });
    };

    isEmail = query => /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i.test(query);

    isFirstName = query => query.length > 1;

    isName = query => query.length > 1;

    onInfoMessageValidate = () => this.dismissInfoMessage();

    render() {
        const { t } = this.props;

        const editUserId = this.state.editUserId ? (
            <td>
                <input
                    value={this.state.userIdValue}
                    placeholder={this.state.suggestedUserId}
                    className="inputValue"
                    onChange={this.onUserIdChange}
                />
                <Button
                    onClick={this.onUserIdEdit}
                    variant="danger"
                    className="editButton"
                >
                    <i className="fas fa-times"></i>
                </Button>
            </td>
        ) : (
            <td>
                <input
                    value={this.state.suggestedUserId}
                    className="inputValue disabled"
                    readOnly
                />
                <Button
                    onClick={this.onUserIdEdit}
                    variant="primary"
                    className="editButton"
                >
                    <i className="fas fa-pencil-alt"></i>
                </Button>
            </td>
        );

        const bottomWell = this.state.infoMessage ? (
            <Alert
                variant={this.state.message.type}
                onClose={this.onInfoMessageValidate}
                dismissible
            >
                <h4>{this.state.message.title}</h4>
                <p>{this.state.message.body}</p>
                <p>
                    <Button
                        variant={this.state.message.type}
                        onClick={this.onInfoMessageValidate}
                    >
                        Ok
                    </Button>
                </p>
            </Alert>
        ) : (
            <div className="bottomButton">
                <Button
                    variant="primary"
                    onClick={this.createUser}
                    disabled={this.state.busy}
                >
                    {t("Create user")}
                </Button>
            </div>
        );

        return (
            <Collapse className="mx-3" in={true} dimension="width" timeout={0}>
                <div>
                    <Card className="rightPanel">
                        <Card.Header className="header-with-button">
                            {t("Create user")}
                            <i
                                className="fas fa-times dismissRight"
                                onClick={this.props.onClose}
                            ></i>
                        </Card.Header>

                        <div className="pannelContainer">
                            <Card.Body>
                                <Card body bg="light">
                                    <Table>
                                        <tbody>
                                            <tr>
                                                <td className="labelText">
                                                    {t("First Name")}:
                                                </td>
                                                <td>
                                                    <input
                                                        onChange={
                                                            this
                                                                .onFirstNameChange
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="labelText">
                                                    {t("Last Name")}:
                                                </td>
                                                <td>
                                                    <input
                                                        onChange={
                                                            this
                                                                .onLastNameChange
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="labelText">
                                                    Email:
                                                </td>
                                                <td>
                                                    <input
                                                        onChange={
                                                            this.onEmailChange
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="labelText">
                                                    {t("User Id")}:
                                                </td>
                                                {editUserId}
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Card>
                            </Card.Body>
                            {bottomWell}
                        </div>
                    </Card>
                </div>
            </Collapse>
        );
    }
}

export default withTranslation()(CreateUserRightPanel);
