import React, { Component } from "react";
import {
    Accordion,
    Collapse,
    Card,
    Button,
    Table,
    Alert,
} from "react-bootstrap";
import { withNamespaces } from "react-i18next";

class UserRightPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: true,
            editEmail: false,
            isEmail: false,
            emailValue: " ",
            busy: false,
        };
    }

    componentDidMount() {
        if (this.props.data["Email"]["data"]) {
            this.setState({ emailValue: this.props.data["Email"]["data"] });
        } else {
            this.setState({ emailValue: " " });
        }
        this.getUsersAdvancedInfos();
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            if (this.props.data["Email"]["data"]) {
                this.setState({ emailValue: this.props.data["Email"]["data"] });
                this.setState({ editEmail: false });
                this.setState({
                    infoMessage: false,
                });
            } else {
                this.setState({ emailValue: " " });
            }
            this.getUsersAdvancedInfos();
        }
    }

    onCancelEdit = () => {
        this.setState({ emailValue: this.props.data["Email"]["data"] });
        this.setState({ editEmail: false });
    };

    onClose = () => {
        this.props.onClose();
    };

    onEmailChange = ev => {
        this.setState({ emailValue: ev.target.value });
        this.setState({ isEmail: false });
        if (this.isEmail(ev.target.value)) {
            this.setState({ isEmail: true });
            this.setState({ new_email: ev.target.value });
        }
    };

    onEmailEdit = () => {
        this.setState({ editEmail: !this.state.editEmail });
    };

    onEmailValidate = async () => {
        const HOME_SERVER = this.props.server;
        const ACCESS_TOKEN = this.props.token;
        try {
            const SERVER_REQUEST = await fetch(
                HOME_SERVER +
                    "_matrix/client/r0/watcha_update_email/" +
                    encodeURIComponent(this.props.data["User name"]["data"]),
                {
                    method: "PUT",
                    headers: {
                        Authorization: "Bearer " + ACCESS_TOKEN,
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
                            this.simplifiedUserId(
                                this.props.data["User name"]["data"]
                            ) + " email has been updated",
                    },
                });
                this.displayInfoMessage();
                this.setState({
                    editEmail: false,
                });
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

    onInfoMessageValidate = () => {
        this.props.refreshRightPanel(this.props.data["User name"]["data"]);
        this.dismissInfoMessage();
    };

    getDate = date => {
        const OPTIONS = { year: "numeric", month: "long", day: "numeric" };
        const FORMATED_DATE =
            date.toLocaleDateString(this.props.lang, OPTIONS) +
            " " +
            this.addZero(date.getHours()) +
            ":" +
            this.addZero(date.getMinutes());
        return FORMATED_DATE;
    };

    getUsersAdvancedInfos = async () => {
        const HOME_SERVER = this.props.server;
        const ACCESS_TOKEN = this.props.token;
        try {
            const SERVER_REQUEST = await fetch(
                HOME_SERVER +
                    "_matrix/client/r0/watcha_user_ip/" +
                    encodeURIComponent(this.props.data["User name"]["data"]),
                {
                    method: "GET",
                    headers: {
                        Authorization: "Bearer " + ACCESS_TOKEN,
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
        const HOME_SERVER = this.props.server;
        const ACCESS_TOKEN = this.props.token;
        const { t } = this.props;
        // activating is the same as resetting the password,
        // but with a different success message
        const messageTitle = isActivating
            ? t("Account reactivated")
            : t("Password reset");
        const messageBody = isActivating
            ? t("The account ") +
              this.simplifiedUserId(this.props.data["User name"]["data"]) +
              t(
                  " has been reactivated, and an email has been sent to the user with a new password"
              )
            : t("an email has been send to ") +
              this.simplifiedUserId(this.props.data["User name"]["data"]) +
              t(" with a new password");
        try {
            const SERVER_REQUEST = await fetch(
                HOME_SERVER +
                    "_matrix/client/r0/watcha_reset_password" +
                    encodeURIComponent(this.props.data["User name"]["data"]),
                {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer " + ACCESS_TOKEN,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user: this.props.data["User name"]["data"],
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

    activateAccount = () => {
        this._doResetPassword(true);
    };

    addZero = number => {
        if (number < 10) {
            number = "0" + number;
        }
        return number;
    };

    deactivateAccount = async () => {
        const HOME_SERVER = this.props.server;
        const ACCESS_TOKEN = this.props.token;
        const { t } = this.props;
        try {
            const SERVER_REQUEST = await fetch(
                HOME_SERVER +
                    "_matrix/client/r0/admin/deactivate/" +
                    encodeURIComponent(this.props.data["User name"]["data"]),
                {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer " + ACCESS_TOKEN,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );
            const RESPONSE = JSON.parse(await SERVER_REQUEST.text());
            if (SERVER_REQUEST.ok) {
                this.setState({
                    message: {
                        type: "success",
                        title: t("Account deactivated"),
                        body:
                            this.simplifiedUserId(
                                this.props.data["User name"]["data"]
                            ) + t(" account has been deactivated"),
                    },
                });
                this.displayInfoMessage();
            } else {
                this.setState({
                    message: {
                        type: "danger",
                        title: t("Deactivation failed"),
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

    dismissInfoMessage = () => {
        this.setState({
            infoMessage: false,
        });
    };

    displayInfoMessage = () => {
        this.setState({
            infoMessage: true,
        });
    };

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

    isEmail = query => {
        return query.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    };

    resetPassword = async () => {
        this._doResetPassword(false);
    };

    simplifiedUserId = fulluserId => {
        let simplifiedUserId = fulluserId.replace("@", "");
        simplifiedUserId = simplifiedUserId.split(":");
        simplifiedUserId = simplifiedUserId[0];
        return simplifiedUserId;
    };

    upgradePartner = async () => {
        const HOME_SERVER = this.props.server;
        const ACCESS_TOKEN = this.props.token;
        try {
            const SERVER_REQUEST = await fetch(
                HOME_SERVER +
                    "_matrix/client/r0/watcha_update_partner_to_member/" +
                    encodeURIComponent(this.props.data["User name"]["data"]),
                {
                    method: "PUT",
                    headers: {
                        Authorization: "Bearer " + ACCESS_TOKEN,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );
            const RESPONSE = JSON.parse(await SERVER_REQUEST.text());
            if (SERVER_REQUEST.ok) {
                this.setState({
                    message: {
                        type: "success",
                        title: "Role updated",
                        body:
                            this.simplifiedUserId(
                                this.props.data["User name"]["data"]
                            ) + " account has been upgraded to internal user",
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
        const ISPARTNER = this.props.data["Status"]["data"] === "Partner";
        const { t } = this.props;
        const OPEN = this.props.data ? true : false;
        const ISDEACTIVATE = !this.props.data["Active"]["data"];
        let editEmail;
        let bsStyle;
        let title;
        const bottomButtons = [];
        bsStyle = "primary";
        title = t("User");

        if (ISDEACTIVATE) {
            bottomButtons.push(
                <Button
                    className="ActivationButton"
                    key="activateAccount"
                    bsStyle="success"
                    onClick={this.activateAccount}
                >
                    {t("Activate account")}
                </Button>
            );
        } else {
            if (ISPARTNER) {
                title = t("Partner");
                bsStyle = "warning";
                bottomButtons.push(
                    <Button
                        className="ActivationButton"
                        bsStyle="success"
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
                    bsStyle="primary"
                    onClick={this.resetPassword}
                >
                    {t("Reset Password")}
                </Button>
            );

            bottomButtons.push(
                <Button
                    className="ActivationButton"
                    key="deactivateAccount"
                    bsStyle="danger"
                    onClick={this.deactivateAccount}
                >
                    {t("Deactivate Account")}
                </Button>
            );
        }
        let emailPlaceholder = "";
        if (this.props.data["email"]) {
            emailPlaceholder = this.props.data["email"]["data"];
        }

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
                    bsStyle='primary'
                    className='editButton'>
                    <i className="fas fa-pencil-alt"></i>
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
                            bsStyle="success"
                            className="validateButton"
                        >
                            <i className="fas fa-check"></i>
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
                            bsStyle="danger"
                            className="cancelButton"
                        >
                            <i className="fas fa-times"></i>
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
                    onDismiss={this.dismissInfoMessage}
                    bsStyle={this.state.message.type}
                >
                    <h4>{this.state.message.title}</h4>
                    <p>{this.state.message.body}</p>
                    <p>
                        <Button
                            bsStyle={this.state.message.type}
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
            <div>
                <Collapse in={OPEN} dimension="width" timeout={0}>
                    <div>
                        <Card className="rightPanel" bg="light">
                            <Card.Header>
                                <Card.Title componentClass="h3">
                                    {title}:{" "}
                                    {this.simplifiedUserId(
                                        this.props.data["User name"]["data"]
                                    )}
                                    <i
                                        className="fas fa-times dismissRight"
                                        onClick={this.onClose}
                                    ></i>
                                </Card.Title>
                            </Card.Header>

                            <div className="pannelContainer">
                                <Card.Body>
                                    <Table>
                                        <tbody>
                                            <tr>
                                                <td className="labelText">
                                                    {t("Creation")}:
                                                </td>
                                                <td className="infoText">
                                                    {
                                                        this.props.data[
                                                            "Date of creation"
                                                        ]["data"]
                                                    }
                                                </td>
                                            </tr>
                                            {/* we don't display device yet but may be useful for e2e
                                            <tr>
                                                <td className='labelText'>Devices:</td>
                                                <td className='infoText'>{ this.props.data.device }</td>
                                            </tr> */}
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
                                                    {t(
                                                        "Show connection history"
                                                    )}
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="0">
                                                <Card.Body>
                                                    <div className="TableAdvanced">
                                                        <Table
                                                            striped
                                                            bordered
                                                            condensed
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
                                                                {
                                                                    advancedUserInfos
                                                                }
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                    </Accordion>
                                </Card.Body>
                                {bottomWell}
                            </div>
                        </Card>
                    </div>
                </Collapse>
            </div>
        );
    }
}

export default withNamespaces("common")(UserRightPanel);
