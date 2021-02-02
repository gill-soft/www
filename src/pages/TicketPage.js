import React, { useState, useEffect } from "react";
import { getTicketInfo } from "../services/api";

const TicketPage = ({ match }) => {
  const [ticket, setTicket] = useState({});
  useEffect(() => {
    const id = match.params.id;
    getTicketInfo(id).then(({ data }) => setTicket({ ticket: data }));
  }, []);
  return (
    <div>
      <h2>TicketPage</h2>
      <pre>{JSON.stringify(ticket, null, 4)}</pre>
    </div>
  );
};

export default TicketPage;
