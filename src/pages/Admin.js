// import React, { useState, useEffect } from "react";
// import { popular } from "../assets/popularsRouts";

// const Admin = () => {
//   const [values, setValues] = useState([]);

//   useEffect(() => {
//     setValues(popular);
//   }, []);
//   const handleChange = (el, { target }) => {
//     console.log(el);
//     console.log(values[el].departure.name);
//     setValues({values[el].departure.name.RU : target.value});
//   };
//   console.log(values);

//   return (
//     <div className="container">
//       <aside>
//         <div>
//           <h2>Menu</h2>
//           <ul>
//             <li>Популярные маршруты</li>
//           </ul>
//         </div>
//       </aside>
//       <main>
//         <h2>Популярные маршруты</h2>
//         <form>
//           {popular.map((el, idx) => (
//             <div>
//               <input
//                 type="text"
//                 value={el.departure.name.RU}
//                 name="from"
//                 onChange={(e) => handleChange(idx, e)}
//               ></input>
//               <input
//                 type="text"
//                 value={el.arrival.name.RU}
//                 name="to"
//                 onChange={(e) => handleChange(idx, e)}
//               ></input>
//               <input
//                 type="text"
//                 value={el.price}
//                 name="price"
//                 onChange={(e) => handleChange(idx, e)}
//               ></input>
//               <input
//                 type="text"
//                 value={el.id}
//                 name="id"
//                 onChange={(e) => handleChange(idx, e)}
//               ></input>
//             </div>
//           ))}
//         </form>
//       </main>
//     </div>
//   );
// };

// export default Admin;
