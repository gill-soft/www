import { fetchAllStops, getError } from "./globalActions";
import { getAllStops } from "../../services/api";

export const fetchStops = () => (dispatch) => {
  getAllStops()
    .then((res) => {
      dispatch(fetchAllStops(res.data));
    })
    .catch((error) => dispatch(getError(error.message)));
};
