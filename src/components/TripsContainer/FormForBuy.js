import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const FormForBuy = () => {
  return (
    <Formik
      initialValues={{ firstName: "", lastName: "", email: "", phone: "" }}
      validationSchema={Yup.object({
        firstName: Yup.string()
          .max(15, "Must be 15 characters or less")
          .required("Required"),
        lastName: Yup.string()
          .max(20, "Must be 20 characters or less")
          .required("Required"),
        email: Yup.string().email("Invalid email address").required("Required"),
        phone: Yup.string()
          .matches(phoneRegExp, "Phone number is not valid")
          .required("Required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        console.log(setSubmitting);
      }}
    >
      <Form>
        <label htmlFor="firstName">First Name</label>
        <Field name="firstName" type="text" />
        <ErrorMessage name="firstName" />
        <label htmlFor="lastName">Last Name</label>
        <Field name="lastName" type="text" />
        <ErrorMessage name="lastName" />
        <label className="label" htmlFor="email">
          Email Address
        </label>
        <Field className="errr" name="email" type="email" />
        <div className="err">
          <ErrorMessage className="errr" name="email" />
        </div>
        <label htmlFor="phone">Number phone</label>
        <Field name="phone" type="text" placeholder="+38" />
        <ErrorMessage name="phone" />
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
};

export default FormForBuy;
