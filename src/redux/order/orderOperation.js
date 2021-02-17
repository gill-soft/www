import { getError } from "../global/globalActions";
import { fetchTicket } from "./orderActions";
import { getTicketInfo } from "../../services/api";

export const getTicket = (id) => (dispatch) => {
  getTicketInfo(id)
    .then(({ data }) => {
      dispatch(fetchTicket(data));
    })
    .catch((error) => dispatch(getError(error.message)));
};
