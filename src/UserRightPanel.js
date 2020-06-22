import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    // faPencilAlt,
    faCheck,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { withTranslation } from "react-i18next";
import moment from "moment";
import Accordion from "react-bootstrap/Accordion";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";

import { MatrixClientContext } from "./contexts";

class UserRightPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editEmail: false,
            isEmail: false,
            emailValue: " ",
            busy: false,
            infoMessage: false,
        };
    }

    static contextType = MatrixClientContext;

    componentDidMount() {
        if (this.props.user.emailAddress) {
            this.setState({ emailValue: this.props.user.emailAddress });
        } else {
            this.setState({ emailValue: " " });
        }
        this.getUsersAdvancedInfos();
    }

    componentDidUpdate(prevProps) {
        if (this.props.user !== prevProps.user) {
            if (this.props.user.emailAddress) {
                this.setState({
                    emailValue: this.props.user.emailAddress,
                    editEmail: false,
                    infoMessage: false,
                });
            } else {
                this.setState({ emailValue: " " });
            }
            this.getUsersAdvancedInfos();
        }
    }

    onCancelEdit = () =>
        this.setState({
            emailValue: this.props.user.emailAddress,
            editEmail: false,
        });

    onEmailChange = ev => {
        this.setState({
            emailValue: ev.target.value,
            isEmail: false,
        });
        if (this.isEmail(ev.target.value)) {
            this.setState({
                isEmail: true,
                new_email: ev.target.value,
            });
        }
    };

    onEmailEdit = () => this.setState({ editEmail: !this.state.editEmail });

    onEmailValidate = async () => {
        const client = this.context;
        try {
            const userId = encodeURIComponent(this.props.user.userId);
            const SERVER_REQUEST = await fetch(
                new URL(
                    `_matrix/client/r0/watcha_update_email/${userId}`,
                    client.baseUrl
                ),
                {
                    method: "PUT",
                    headers: {
                        Authorization: "Bearer " + client.getAccessToken(),
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ new_email: this.state.new_email }),
                }
            );
            const RESPONSE = JSON.parse(await SERVER_REQUEST.text());
            if (SERVER_REQUEST.ok) {
                this.setState({
                    message: {
                        type: "success",
                        title: "Email updated",
                        body:
                            this.simplifiedUserId(this.props.user.userId) +
                            " email has been updated",
                    },
                });
                this.displayInfoMessage();
                this.setState({ editEmail: false });
            } else {
                this.setState({
                    message: {
                        type: "danger",
                        title: "Email update failed",
                        body: RESPONSE["error"],
                    },
                });
                this.displayInfoMessage();
            }
        } catch (e) {
            console.log("error: " + e);
            return;
        }
    };

    onInfoMessageValidate = () => this.dismissInfoMessage();

    getDate = date => {
        const OPTIONS = { year: "numeric", month: "long", day: "numeric" };
        const FORMATED_DATE =
            date.toLocaleDateString(this.props.i18n.language, OPTIONS) +
            " " +
            this.addZero(date.getHours()) +
            ":" +
            this.addZero(date.getMinutes());
        return FORMATED_DATE;
    };

    getUsersAdvancedInfos = async () => {
        const client = this.context;
        try {
            const userId = encodeURIComponent(this.props.user.userId);
            const SERVER_REQUEST = await fetch(
                new URL(
                    `_matrix/client/r0/watcha_user_ip/${userId}`,
                    client.baseUrl
                ),
                {
                    method: "GET",
                    headers: {
                        Authorization: "Bearer " + client.getAccessToken(),
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );
            const RESPONSE = JSON.parse(await SERVER_REQUEST.text());
            if (!SERVER_REQUEST.ok) {
                this.setState({
                    message: {
                        type: "danger",
                        title: "Failed to fetch info",
                        body: RESPONSE["error"],
                    },
                });
                this.displayInfoMessage();
            } else {
                this.setState({
                    userInfos: RESPONSE,
                });
            }
        } catch (e) {
            console.log("error: " + e);
            return;
        }
    };

    _doResetPassword = async isActivating => {
        const client = this.context;
        const { t } = this.props;
        // activating is the same as resetting the password,
        // but with a different success message
        const messageTitle = isActivating
            ? t("Account reactivated")
            : t("Password reset");
        const messageBody = isActivating
            ? t("The account ") +
              this.simplifiedUserId(this.props.user.userId) +
              t(
                  " has been reactivated, and an email has been sent to the user with a new password"
              )
            : t("an email has been send to ") +
              this.simplifiedUserId(this.props.user.userId) +
              t(" with a new password");
        try {
            const userId = encodeURIComponent(this.props.user.userId);
            const SERVER_REQUEST = await fetch(
                new URL(
                    `_matrix/client/r0/watcha_reset_password/${userId}`,
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
                        user: this.props.user.userId,
                    }),
                }
            );
            const RESPONSE = JSON.parse(await SERVER_REQUEST.text());
            if (SERVER_REQUEST.ok) {
                this.setState({
                    message: {
                        type: "success",
                        title: messageTitle,
                        body: messageBody,
                    },
                });
                this.displayInfoMessage();
            } else {
                this.setState({
                    message: {
                        type: "danger",
                        title: t("Password reset failed"),
                        body: RESPONSE["error"],
                    },
                });
                this.displayInfoMessage();
            }
        } catch (e) {
            console.log("error: " + e);
            return;
        }
    };

    activateAccount = () => this._doResetPassword(true);

    addZero = number => (number < 10 ? "0" + number : number);

    deactivateSynapseUser = () => {
        const { t } = this.props;
        const client = this.context;
        const userId = this.props.user.userId;
        client
            .deactivateSynapseUser(userId)
            .then(response =>
                this.setState(
                    {
                        message: {
                            type: "success",
                            title: t("Account deactivated"),
                            body:
                                this.simplifiedUserId(this.props.user.userId) +
                                t(" account has been deactivated"),
                        },
                    },
                    this.displayInfoMessage
                )
            )
            .catch(error => {
                console.error("Failed to deactivate user");
                console.error(error);
                this.setState(
                    {
                        message: {
                            type: "danger",
                            title: t("Deactivation failed"),
                            body: error.message,
                        },
                    },
                    this.displayInfoMessage
                );
            });
    };

    dismissInfoMessage = () => this.setState({ infoMessage: false });

    displayInfoMessage = () => this.setState({ infoMessage: true });

    identifyUserAgent = (userAgent, elements) => {
        const REGEXPS = {
            Chrome: [/Chrome\/(\S+)/],
            Firefox: [/Firefox\/(\S+)/],
            MSIE: [/MSIE (\S+);/],
            Opera: [
                /Opera\/.*?Version\/(\S+)/ /* Opera 10 */,
                /Opera\/(\S+)/ /* Opera 9 and older */,
            ],
            Safari: [/Version\/(\S+).*?Safari\//],
        };
        let re;
        let m;
        let browser;
        let version;
        if (userAgent === undefined) {
            userAgent = navigator.userAgent;
        }
        if (elements === undefined) {
            elements = 2;
        } else if (elements === 0) {
            elements = 1337;
        }
        for (browser in REGEXPS) {
            if ({}.hasOwnProperty.call(REGEXPS, browser)) {
                while ((re = REGEXPS[browser].shift())) {
                    if ((m = userAgent.match(re))) {
                        version = m[1].match(
                            new RegExp("[^.]+(?:.[^.]+){0," + --elements + "}")
                        )[0];
                        return browser + " " + version;
                    }
                }
            }
        }
        return null;
    };

    isEmail = query => /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i.test(query);

    resetPassword = async () => this._doResetPassword(false);

    simplifiedUserId = fulluserId => {
        let simplifiedUserId = fulluserId.replace("@", "");
        simplifiedUserId = simplifiedUserId.split(":");
        simplifiedUserId = simplifiedUserId[0];
        return simplifiedUserId;
    };

    upgradePartner = async () => {
        const client = this.context;
        try {
            const userId = encodeURIComponent(this.props.user.userId);
            const SERVER_REQUEST = await fetch(
                new URL(
                    `_matrix/client/r0/watcha_update_user_role/${userId}`,
                    client.baseUrl
                ),
                {
                    method: "PUT",
                    headers: {
                        Authorization: "Bearer " + client.getAccessToken(),
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        role: "collaborator",
                    }),
                }
            );
            const RESPONSE = JSON.parse(await SERVER_REQUEST.text());
            if (SERVER_REQUEST.ok) {
                this.setState({
                    message: {
                        type: "success",
                        title: "Role updated",
                        body:
                            this.simplifiedUserId(this.props.user.userId) +
                            " account has been upgraded to internal user",
                    },
                });
                this.displayInfoMessage();
            } else {
                this.setState({
                    message: {
                        type: "danger",
                        title: "upgrade failed",
                        body: RESPONSE["error"],
                    },
                });
                this.displayInfoMessage();
            }
        } catch (e) {
            console.log("error: " + e);
            return;
        }
    };

    render() {
        const ISPARTNER = this.props.user.role === "partner";
        const { t } = this.props;
        const ISDEACTIVATE = this.props.user.status === "inactive";
        let editEmail;
        const bottomButtons = [];
        let title = t(`${this.props.user.role}`, { count: 1 });

        if (ISDEACTIVATE) {
            bottomButtons.push(
                <Button
                    className="ActivationButton"
                    key="activateAccount"
                    variant="success"
                    onClick={this.activateAccount}
                >
                    {t("Activate account")}
                </Button>
            );
        } else {
            if (ISPARTNER) {
                bottomButtons.push(
                    <Button
                        className="ActivationButton"
                        variant="success"
                        key="upgradeToMember"
                        onClick={this.upgradePartner}
                    >
                        {t("Upgrade to internal user")}
                    </Button>
                );
            }
            bottomButtons.push(
                <Button
                    className="ActivationButton"
                    key="resetPassword"
                    variant="primary"
                    onClick={this.resetPassword}
                >
                    {t("Reset Password")}
                </Button>
            );

            bottomButtons.push(
                <Button
                    className="ActivationButton"
                    key="deactivateAccount"
                    variant="danger"
                    onClick={this.deactivateSynapseUser}
                >
                    {t("Deactivate Account")}
                </Button>
            );
        }
        let emailPlaceholder = this.props.user.emailAddress;

        editEmail = (
            <td>
                <input
                    value={this.state.emailValue}
                    readOnly
                    type="email"
                    placeholder={emailPlaceholder}
                    className="inputValue disabled"
                />
                {/* <Button
                    onClick={this.onEmailEdit}
                    variant="primary"
                    className="editButton"
                >
                    <FontAwesomeIcon icon={faPencilAlt} />
                </Button> */}
            </td>
        );
        if (this.state.editEmail) {
            if (this.state.isEmail) {
                editEmail = (
                    <td>
                        <input
                            value={this.state.emailValue}
                            type="email"
                            placeholder={emailPlaceholder}
                            onChange={this.onEmailChange}
                            ref="inputValue"
                            className="inputValue"
                        />
                        <Button
                            onClick={this.onEmailValidate}
                            variant="success"
                            className="validateButton"
                        >
                            <FontAwesomeIcon icon={faCheck} />
                        </Button>
                    </td>
                );
            } else {
                editEmail = (
                    <td>
                        <input
                            value={this.state.emailValue}
                            type="email"
                            placeholder={emailPlaceholder}
                            onChange={this.onEmailChange}
                            className="inputValue"
                        />
                        <Button
                            onClick={this.onCancelEdit}
                            variant="danger"
                            className="cancelButton"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </Button>
                    </td>
                );
            }
        }
        const advancedUserInfos = [];
        let bottomWell;
        if (this.state.infoMessage) {
            bottomWell = (
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
            );
        } else {
            bottomWell = <div className="bottomButton">{bottomButtons}</div>;
        }

        if (this.state.userInfos) {
            for (const connections in this.state.userInfos) {
                if ({}.hasOwnProperty.call(this.state.userInfos, connections)) {
                    this.identifyUserAgent(
                        this.state.userInfos[connections][1],
                        2
                    );
                    const DATE = new Date(this.state.userInfos[connections][2]);
                    advancedUserInfos.push(
                        <tr key={connections}>
                            <td>{this.getDate(DATE)}</td>
                            <td>
                                {this.identifyUserAgent(
                                    this.state.userInfos[connections][1]
                                )}
                            </td>
                            <td>{this.state.userInfos[connections][0]}</td>
                        </tr>
                    );
                }
            }
        }

        return (
            <div className="mx-3">
                <Card className="rightPanel">
                    <Card.Header className="header-with-button">
                        {title +
                            " : " +
                            this.simplifiedUserId(this.props.user.userId)}
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
                                                {t("Creation")}:
                                            </td>
                                            <td className="infoText">
                                                {moment(
                                                    this.props.user.creationTs
                                                ).format("LLLL")}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="labelText">
                                                {t("Email")}:
                                            </td>
                                            {editEmail}
                                        </tr>
                                    </tbody>
                                </Table>
                                <Accordion>
                                    <Card id="collapsible-panel-users">
                                        <Card.Header>
                                            <Accordion.Toggle
                                                as={Button}
                                                variant="link"
                                                eventKey="0"
                                            >
                                                {t("Show connection history")}
                                            </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey="0">
                                            <Card.Body>
                                                <div className="TableAdvanced">
                                                    <Table
                                                        striped
                                                        bordered
                                                        size="sm"
                                                        hover
                                                    >
                                                        <thead>
                                                            <tr>
                                                                <th>
                                                                    {t(
                                                                        "Connected"
                                                                    )}
                                                                </th>
                                                                <th>
                                                                    {t(
                                                                        "Device"
                                                                    )}
                                                                </th>
                                                                <th>Ip</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="AdvancedUserBody">
                                                            {advancedUserInfos}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion>
                            </Card>
                        </Card.Body>
                        {bottomWell}
                    </div>
                </Card>
            </div>
        );
    }
}

export default withTranslation()(UserRightPanel);
