import { getError } from "../global/globalActions";
import { fetchTicket } from "./orderActions";
import { getTicketConfirm, getTicketInfo } from "../../services/api";

export const getTicket = (id) => (dispatch) => {
  getTicketInfo(id)
    .then(({ data }) => dispatch(fetchTicket(data)))
    .catch((error) => dispatch(getError(error.message)));
};
export const getConfirm = (id) => (dispatch) => {
  getTicketConfirm(id)
    .then(({ data }) => dispatch(fetchTicket(data)))
    .catch((error) => dispatch(getError(error.message)));
};
