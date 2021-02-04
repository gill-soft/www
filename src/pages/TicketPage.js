import React, { useState, useEffect } from "react";
import { getTicketInfo } from "../services/api";
import styles from "./TicketPage.module.css";

const TicketPage = ({ match }) => {
  const [ticket, setTicket] = useState({});
  useEffect(() => {
    const id = match.params.id;
    getTicketInfo(id).then(({ data }) => setTicket({ ticket: data }));
  }, [match.params.id]);
  return (
    <div className={styles.bgnd}>
      <div className={styles.container}>
        <h2>TicketPage</h2>
        <pre>{JSON.stringify(ticket, null, 4)}</pre>
      </div>
    </div>
  );
};

export default TicketPage;
