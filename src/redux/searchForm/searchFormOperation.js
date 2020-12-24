import { fetchAllStopsSuccess } from './searchFormAction';
import { getAllStops } from '../../services/api';

export const fetchStops = () => dispatch => {
  getAllStops().then(res => {
    dispatch(fetchAllStopsSuccess(res.data));
  });
  // .catch(error => dispatch(fetchArtistError(error.message)));
};
