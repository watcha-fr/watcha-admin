import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

import { Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAt } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import "./css/NewUserForm.scss";

const NewUserForm = ({ userList, onSubmit, bindSubmitForm, feedback }) => {
    const { t } = useTranslation("usersTab");

    const resetFormRef = useRef();
    const bindResetForm = resetForm => {
        resetFormRef.current = resetForm;
    };

    useEffect(() => {
        if (!feedback) {
            resetFormRef.current();
        }
    }, [feedback]);

    const schema = yup.object({
        emailAddress: yup
            .string()
            .required(t("requiered.emailAddress"))
            .email(t("invalid", { field: "$t(invalidField.emailAddress)" }))
            .test(
                "is-available",
                t("unavailableEmailAddress"),
                value => !value || userList.every(user => user.emailAddress !== value)
            ),
        isSynapseAdministrator: yup.bool(),
    });

    return (
        <Formik
            initialValues={{
                emailAddress: "",
                isSynapseAdministrator: false,
            }}
            validationSchema={schema}
            {...{ onSubmit }}
        >
            {({ handleChange, handleSubmit, submitForm, resetForm, values, touched, errors }) => {
                bindSubmitForm(submitForm);
                bindResetForm(resetForm);
                return (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        <FontAwesomeIcon icon={faAt} fixedWidth />
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                    className="rightRoundedInput"
                                    type="email"
                                    name="emailAddress"
                                    placeholder={t("emailAddress")}
                                    value={values.emailAddress}
                                    onChange={handleChange}
                                    isValid={values.emailAddress && !errors.emailAddress}
                                    isInvalid={touched.emailAddress && !!errors.emailAddress}
                                    readOnly={feedback}
                                />
                                <Form.Control.Feedback type="invalid">{errors.emailAddress}</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <Form.Check
                            custom
                            id="isSynapseAdministrator"
                            name="isSynapseAdministrator"
                            label={t("synapseAdminCheckbox")}
                            checked={values.isSynapseAdministrator}
                            onChange={handleChange}
                            disabled={feedback}
                        />

                        {/* This button is only required to submit the form from a field by pressing the enter key.
                        It is therefore hidden. The button actually used is rendered in the parent component. */}
                        <Button type="submit" disabled={feedback} style={{ display: "none" }} />
                    </Form>
                );
            }}
        </Formik>
    );
};

NewUserForm.defaultProps = {
    feedback: null,
};

NewUserForm.propTypes = {
    userList: PropTypes.arrayOf(
        PropTypes.shape({
            userId: PropTypes.string.isRequired,
            itemId: PropTypes.string,
            displayName: PropTypes.string.isRequired,
            emailAddress: PropTypes.string.isRequired,
            lastSeen: PropTypes.number,
            role: PropTypes.string.isRequired,
            creationTs: PropTypes.number,
        })
    ).isRequired,
    onSubmit: PropTypes.func.isRequired,
    bindSubmitForm: PropTypes.func.isRequired,
    feedback: PropTypes.shape({
        variant: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
    }),
};

export default NewUserForm;
