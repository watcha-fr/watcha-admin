import React, { useMemo } from "react";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const namePattern = "[a-z\u00C0-\u017F]{2,}";

export default ({ userList, onSubmit, bindSubmitForm }) => {
    const { t } = useTranslation("usersTab");

    const schema = useMemo(
        () =>
            yup.object({
                fullName: yup
                    .string()
                    .required(t("requiered.fullName"))
                    .matches(
                        new RegExp(`^${namePattern} ${namePattern}$`, "i"),
                        t("invalid", { field: "$t(invalidField.fullName)" })
                    ),
                emailAddress: yup
                    .string()
                    .required(t("requiered.emailAddress"))
                    .email(
                        t("invalid", { field: "$t(invalidField.emailAddress)" })
                    )
                    .test(
                        "is-available",
                        t("unavailableEmailAddress"),
                        value =>
                            !value ||
                            !userList.some(user => user.emailAddress === value)
                    ),
            }),
        [userList, t]
    );

    return (
        <Formik
            initialValues={{
                fullName: "",
                emailAddress: "",
            }}
            validationSchema={schema}
            {...{ onSubmit }}
        >
            {({
                handleChange,
                handleSubmit,
                submitForm,
                values,
                touched,
                errors,
            }) => {
                bindSubmitForm(submitForm);
                return (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        <i className="fas fa-user fa-fw"></i>
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
                                        <i className="fas fa-at fa-fw"></i>
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
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.emailAddress}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <Button
                            type="submit"
                            style={{ display: "none" }}
                        ></Button>
                    </Form>
                );
            }}
        </Formik>
    );
};
