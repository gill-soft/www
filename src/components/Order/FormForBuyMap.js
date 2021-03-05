import React, { Component } from "react";
import { Formik, Form, Field, FieldArray } from "formik";

import * as Yup from "yup";

const SignupSchema = Yup.object().shape({
  friends: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().min(4, "too short").required("Required"), // these constraints take precedence
    })
  ),
});
// [  ONLY_LATIN, GENDER, CITIZENSHIP, DOCUMENT_TYPE, DOCUMENT_NUMBER, DOCUMENT_SERIES, BIRTHDAY, SEAT, TARIFF ]
class FormForBuyMap extends Component {
  render() {
    return (
      <div>
        <h1>Passengers List</h1>
        {console.log(this.props.pass)}
        <Formik
          initialValues={this.props.pass}
          validationSchema={SignupSchema}
          onSubmit={(values) => {
            values.pass.map((el) => (el.email = values.email));
            console.log(values);
          }}
          render={({ values, errors, touched }) => (
            <Form>
              <FieldArray
                name="pass"
                render={(arrayHelpers) => (
                  <div>
                    {values.pass.map((el, idx) => (
                      <div key={idx}>
                        {/** both these conventions do the same */}
                        {this.props.array.indexOf("NAME") >= 0 && (
                          <>
                            <Field name={`pass[${idx}].name`} />
                            {errors.name && touched.name ? (
                              <div>{errors.name}</div>
                            ) : null}
                          </>
                        )}
                        {this.props.array.indexOf("SURNAME") >= 0 && (
                          <Field name={`pass[${idx}].surname`} />
                        )}

                        {this.props.array.indexOf("PHONE") >= 0 && (
                          <Field name={`pass[${idx}].phone`} placeholder="phone**" />
                        )}
                        {this.props.array.indexOf("PATRONYMIC") >= 0 && (
                          <Field
                            name={`pass[${idx}].patronymic`}
                            placeholder="PATRONYMIC**"
                          />
                        )}
                        {this.props.array.indexOf("GENDER") >= 0 && (
                          <Field name={`pass[${idx}].gender`} as="select">
                            {["M", "F"].map((el) => (
                              <option value={el}>{el}</option>
                            ))}
                          </Field>
                        )}

                        <button type="button" onClick={() => arrayHelpers.remove(idx)}>
                          -
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => arrayHelpers.push({})}>
                      +
                    </button>
                  </div>
                )}
              />
              <Field name={"email"} />

              <div>
                <button type="submit">Submit</button>
              </div>
            </Form>
          )}
        />
      </div>
    );
  }
}
export default FormForBuyMap;
