// import React from "react";
// import { useHistory } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { IntlProvider, FormattedMessage } from "react-intl";
// import { messanges } from "../../intl/NavMessanges";
// import styles from "./AgentHeader.module.css";

// const AgentHeader = () => {
//   const lang = useSelector((state) => state.language);
//   const locale = lang === "UA" ? "UK" : lang;
//   const agent = JSON.parse(localStorage.getItem("auth"));
//   const history = useHistory();
//   const handleExit = () => {
//     localStorage.removeItem("auth");
//     history.push("/");
//     window.location.reload();
//   };
//   return (
//     <IntlProvider locale={locale} messages={messanges[locale]}>
//       <div className={styles.agentBox}>
//         <p>
//           <FormattedMessage id="login" />
//           <span> {agent.clientName || agent.login}</span>
//         </p>
//         <button onClick={handleExit}>
//           <FormattedMessage id="exit" />
//         </button>
//       </div>
//     </IntlProvider>
//   );
// };

// export default AgentHeader;
