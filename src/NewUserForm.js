import React, { useEffect, useRef } from "react";
import { Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faAt } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const NAME_PATTERN = "[a-z\u00C0-\u017F]{2,}";

export default ({ userList, onSubmit, bindSubmitForm, feedback }) => {
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
        fullName: yup
            .string()
            .required(t("requiered.fullName"))
            .matches(
                new RegExp(`^${NAME_PATTERN} ${NAME_PATTERN}$`, "i"),
                t("invalid", { field: "$t(invalidField.fullName)" })
            ),
        emailAddress: yup
            .string()
            .required(t("requiered.emailAddress"))
            .email(t("invalid", { field: "$t(invalidField.emailAddress)" }))
            .test(
                "is-available",
                t("unavailableEmailAddress"),
                value =>
                    !value ||
                    !userList.some(user => user.emailAddress === value)
            ),
        isSynapseAdministrator: yup.bool(),
    });

    return (
        <Formik
            initialValues={{
                fullName: "",
                emailAddress: "",
                isSynapseAdministrator: false,
            }}
            validationSchema={schema}
            {...{ onSubmit }}
        >
            {({
                handleChange,
                handleSubmit,
                submitForm,
                resetForm,
                values,
                touched,
                errors,
            }) => {
                bindSubmitForm(submitForm);
                bindResetForm(resetForm);
                return (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        <FontAwesomeIcon
                                            icon={faUser}
                                            fixedWidth
                                        />
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                    className="rightRoundedInput"
                                    type="text"
                                    name="fullName"
                                    placeholder={t("fullName")}
                                    value={values.fullName}
                                    onChange={handleChange}
                                    isValid={
                                        values.fullName && !errors.fullName
                                    }
                                    isInvalid={
                                        touched.fullName && !!errors.fullName
                                    }
                                    readOnly={feedback}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.fullName}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        <FontAwesomeIcon
                                            icon={faAt}
                                            fixedWidth
                                        />
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                    className="rightRoundedInput"
                                    type="email"
                                    name="emailAddress"
                                    placeholder={t("emailAddress")}
                                    value={values.emailAddress}
                                    onChange={handleChange}
                                    isValid={
                                        values.emailAddress &&
                                        !errors.emailAddress
                                    }
                                    isInvalid={
                                        touched.emailAddress &&
                                        !!errors.emailAddress
                                    }
                                    readOnly={feedback}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.emailAddress}
                                </Form.Control.Feedback>
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
                        <Button
                            type="submit"
                            disabled={feedback}
                            style={{ display: "none" }}
                        ></Button>
                    </Form>
                );
            }}
        </Formik>
    );
};
