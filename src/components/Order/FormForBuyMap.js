import React, { useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";

// Here is an example of a form with an editable list.
// Next to each input are buttons for insert and remove.
// If the list is empty, there is a button to add an item.
const FormForBuyMap = ({ array }) => {
  const [pass, setPass] = useState([{}, {}]);
  // useEffect(() => {
  //   setPass()
  // }, [])

  return (
    <div>
      <h1>Friend List</h1>
      <Formik
        initialValues={{ friends: pass }}
        onSubmit={(values) => console.log(values.friends)}
        render={({ values }) => (
          <Form>
            <FieldArray
              name="friends"
              render={(arrayHelpers) => (
                <div>
                  {console.log(values)}
                  {values.friends.map((el, idx) => (
                    <div key={idx}>
                      {/** both these conventions do the same */}
                      {array.map((el) => {
                        console.log(el);
                        if (el === "NAME") {
                          return <Field name={`friends[${idx}][${el}]`} />;
                        }
                        if (el === "PHONE") {
                          return (
                            <Field name={`friends[${idx}][${el}]`} type="checkbox" />
                          );
                        }
                      })}
                      {/* <Field name={`friends[${idx}].name`} />
                      <Field name={`friends.${idx}.phine`} /> */}

                      <button type="button" onClick={() => arrayHelpers.remove(idx)}>
                        -
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => arrayHelpers.push({ name: "", age: "" })}
                  >
                    +
                  </button>
                </div>
              )}
            />
            <div>
              <button type="submit">Submit</button>
            </div>
          </Form>
        )}
      />
    </div>
  );
};
export default FormForBuyMap;
