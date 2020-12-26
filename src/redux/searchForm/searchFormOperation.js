import { fetchAllStopsSuccess, fetchAllStopsError } from './searchFormAction';
import { getAllStops } from '../../services/api';

export const fetchStops = () => dispatch => {
  getAllStops()
    .then(res => {
      dispatch(fetchAllStopsSuccess(res.data));
    })
    .catch(error => dispatch(fetchAllStopsError(error.message)));
};
