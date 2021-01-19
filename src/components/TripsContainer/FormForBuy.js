// import React from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";

// const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

// const FormForBuy = () => {
//   return (
//     <Formik
//       initialValues={{ firstName: "", lastName: "", email: "", phone: "" }}
//       validationSchema={Yup.object({
//         firstName: Yup.string()
//           .max(15, "Must be 15 characters or less")
//           .required("Required"),
//         lastName: Yup.string()
//           .max(20, "Must be 20 characters or less")
//           .required("Required"),
//         email: Yup.string().email("Invalid email address").required("Required"),
//         phone: Yup.string()
//           .matches(phoneRegExp, "Phone number is not valid")
//           .required("Required"),
//       })}
//       onSubmit={(values, { setSubmitting }) => {
//         console.log(setSubmitting);
//       }}
//     >
//       <Form>
//         <label htmlFor="firstName">First Name</label>
//         <Field name="firstName" type="text" />
//         <ErrorMessage name="firstName" />
//         <label htmlFor="lastName">Last Name</label>
//         <Field name="lastName" type="text" />
//         <ErrorMessage name="lastName" />
//         <label className="label" htmlFor="email">
//           Email Address
//         </label>
//         <Field className="errr" name="email" type="email" />
//         <div className="err">
//           <ErrorMessage className="errr" name="email" />
//         </div>
//         <label htmlFor="phone">Number phone</label>
//         <Field name="phone" type="text" placeholder="+38" />
//         <ErrorMessage name="phone" />
//         <button type="submit">Submit</button>
//       </Form>
//     </Formik>
//   );
// };

// export default FormForBuy;

import React, { Component } from "react";
import { connect } from "react-redux";

class FormForBuy extends Component {
  state = {
    // valueName: null,
    // valuePhone: '',
    // valueEmail: '',
    values: []
  };
//   componentDidMount() {
//     this.setState({valueI: this.props.amountPassangers.map(el => {
//        return el
//     })
//   })
// }

  hdls = (e) => {
    e.preventDefault();
    console.log("object");
  };
  handleChangeName = (el, e ) => {
    console.log(el, e.target.value)
    const value = e.target.value;
    const name = el;
    // console.log(name)
    this.setState((prev) => ({[name]: {...prev[`${el}`], name:value}}));
    // this.setState({ [name]: {name:value} });
  };
  handleChangePhone = (el, e ) => {
    console.log(el, e.target.value)
    const value = e.target.value;
    const name = el;
    // console.log(name)
    // this.setState((prev) => ({[name]: {...prev, name:value}}));
    this.setState((prev) => ({[name]: {...prev[`${el}`], phone:value}}));

    // this.setState({ [name]: {phone:value} });
  };

  render() {
    // console.log(this.state);
    return (
      <div>
        <pre>{JSON.stringify(this.state, null, 4)}</pre>
        <form onSubmit={this.hdls}>
          {this.props.amountPassangers.map((el, idx) => {
            return (
              <>
                <input
                  name={`name${el}`}
                  value={this.state.el}
                  onChange={(e)=>this.handleChangeName(el, e)}
                  placeholder='name'
                />
                <input
                  name={`phone${el}`}
                  value={this.state.el}
                  onChange={(e)=>this.handleChangePhone(el, e)}
                  placeholder='phone'

                />
<br></br>
              </>
            );
          })}
          <input tepe="email" name="email" onChange={this.handleChange} />
          <button type="submit">Buy</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  amountPassangers: state.order.amountPassangers,
});

export default connect(mapStateToProps)(FormForBuy);
