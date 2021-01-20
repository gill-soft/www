// import React, {useState} from "react";
// import { connect } from "react-redux";
// import { Formik, Form, useField } from "formik";
// import * as Yup from "yup";
// import { SendInfoPassanger } from "../../redux/order/orderActions";
// import FormForBuy from "../TripsContainer/FormForBuy";
// const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

// const PassengersInfo = ({ n, SendInfoPassanger, amountPassangers }) => {

//     const [valueName, setValueName] = useState('')

//   const handleChange = ({ target }) => {
//       setValueName(target.value)
//     // const info = {
//     //   name: valueName
//     // };
//     // SendInfoPassanger(info);
//   };

//   return (
//     <div>
//       <h4>Пассажир {n}</h4>
//       {/*  */}

//       {/* <Formik
//         initialValues={{ firstName: "", lastName: "", email: "" }}
//         validationSchema={Yup.object({
//           firstName: Yup.string()
//             .max(15, "Must be 15 characters or less")
//             .required("Required"),
//           lastName: Yup.string()
//             .max(20, "Must be 20 characters or less")
//             .required("Required"),
//         })}
//       >
//         {(formik) => (
//           <form>
//             <label htmlFor="firstName">First Name</label>
//             <input name="firstName" type="text" {...formik.getFieldProps("firstName")} value={valueName} onChange={handleChange}/>
//             {formik.touched.firstName && formik.errors.firstName ? (
//               <div>{formik.errors.firstName}</div>
//             ) : null}
//             <label htmlFor="lastName">Last Name</label>
//             <input name="lastName" type="text" {...formik.getFieldProps("lastName")} />
//             {formik.touched.lastName && formik.errors.lastName ? (
//               <div>{formik.errors.lastName}</div>
//             ) : null}
//           </form>
//         )}
//       </Formik> */}

//       {/*  */}
//       <FormForBuy />
//     </div>
//   );
// };
// // const mapStateToProps = (state) => ({});
// const mapStateToProps = (state) => ({
//     amountPassangers: state.order.amountPassangers
//   });

// const mapDispatchToProps = (dispatch) => ({
//   SendInfoPassanger: (arr) => dispatch(SendInfoPassanger(arr)),
  
// });

// export default connect(mapStateToProps, mapDispatchToProps)(PassengersInfo);
