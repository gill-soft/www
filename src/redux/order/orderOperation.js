import { getError } from "../global/globalActions";
import { fetchTicket } from "./orderActions";
import { getTicketInfo, ticketComfirm } from "../../services/api";

export const getTicket = (orderId) => (dispatch) => {
  getTicketInfo(orderId)
    .then(({ data }) => dispatch(fetchTicket(data)))
    .catch((error) => dispatch(getError(error.message)));
};

export const getTicketConfirm = (orderId, paymentId) => (dispatch) => {
  console.log(paymentId)
  ticketComfirm(orderId, paymentId)
    .then(({ data }) => dispatch(fetchTicket(data)))
    .catch((error) => dispatch(getError(error.message)));
};
