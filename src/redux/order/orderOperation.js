import { getError } from "../global/globalActions";
import { fetchTicket, setWallet } from "./orderActions";
import { getTicketInfo, getWallet, ticketComfirm } from "../../services/api";

export const getTicket = (orderId) => (dispatch) => {
  getTicketInfo(orderId)
    .then(({ data }) => dispatch(fetchTicket(data)))
    .catch((error) => dispatch(getError(error.message)));
};

export const getTicketConfirm = (orderId, paymentId) => (dispatch) => {
  ticketComfirm(orderId, paymentId)
    .then(({ data }) => dispatch(fetchTicket(data)))
    .catch((error) => dispatch(getError(error.message)));
};

export const getWalletInfo = () => (dispatch) => {
  getWallet()
    .then(({ data }) => dispatch(setWallet(data)))
    .catch((error) =>
      error.response.status !== 401 ? dispatch(getError(error.message)) : null
    );
};
