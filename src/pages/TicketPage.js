import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Modal from "../components/Modal/Modal";
import GoHome from "../components/GoHome/GoHome";
import { getTicket } from "../redux/order/orderOperation";
import styles from "./TicketPage.module.css";
import { messages } from "../intl/TicketPageMessanges";
import Timer from "../components/TicketContainer/Timer";
import TripInfo from "../components/TicketContainer/TripInfo";
import PassengersData from "../components/TicketContainer/PassengersData";

const TicketPage = ({ lang, match, ticket, getTicket }) => {
  const [isModal, setIsModal] = useState(false);

  // ==== получаем информацию о билете ==== //
  useEffect(() => {
    const id = match.params.id;
    getTicket(id);
  }, [getTicket, match.params.id]);

  const getTotalPrice = () =>
    ticket.services.reduce((acc, el) => {
      return acc + el.price.amount;
    }, 0);

  // ==== получаем название населенного пункта отправки/прибытия ====//
  const getLocality = (type) => {
    const tripKey = Object.keys(ticket.segments)[0];
    const stopId = ticket.segments[`${tripKey}`][`${type}`].id;
    const id = ticket.localities[`${stopId}`].parent.id;
    return ticket.localities[`${id}`]?.name[`${lang}`];
  };

  // ==== получаем время отправки/прибытия ====//
  const getDate = (type) => {
    const tripKey = Object.keys(ticket.segments)[0];
    return ticket.segments[`${tripKey}`][`${type}`];
  };
  return (
    <div className={styles.bgnd}>
      <div className={styles.container}>
        {Object.keys(ticket).length > 0 && (
          <>
            <TripInfo ticket={ticket} getLocality={getLocality} getDate={getDate} />
            <PassengersData ticket={ticket} />
            <Timer />
            {/* portmone */}
            <form action="https://www.portmone.com.ua/gateway/" method="post">
              <input type="hidden" name="payee_id" value="1185" />
              <input type="hidden" name="shop_order_number" value={ticket.orderId} />
              <input type="hidden" name="bill_amount" value={getTotalPrice()} />
              <input
                type="hidden"
                name="description"
                value={`${getLocality("departure")} -
                     ${getLocality("arrival")} ${getDate("departureDate")}`}
              />
              <input
                type="hidden"
                name="success_url"
                value={`http://localhost:3000/#/myTicket/${match.params.id}`}
              />
              <input type="hidden" name="failure_url" value="http://localhost:3000" />
              <input type="hidden" name="lang" value={lang.toLowerCase()} />
              <input type="hidden" name="encoding" value="UTF-8" />
              <input type="hidden" name="exp_time" value={"400"} />
              <button type="submit">portmone</button>
            </form>
            {/* portmone */}

            {/* {!!isModal && <Modal  component={<GoHome />} isGohome={true}/>} */}
          </>
        )}

        {/* <pre>{JSON.stringify(ticket, null, 4)} </pre> */}
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  ticket: state.order.ticket,
  lang: state.language,
  price: state.order.order.priceId,
});

const mapDispatchToProps = (dispatch) => ({
  getTicket: (id) => dispatch(getTicket(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TicketPage);
