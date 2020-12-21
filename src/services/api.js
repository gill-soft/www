import axios from 'axios';
const baseUrl = 'https://busis.eu/gds-control/api/v1';
const localityAll = '/locality/all';

export const getAllStops = () => {
  return axios({
    method: 'get',
    url: `${baseUrl}${localityAll}`,
    headers: {
      Authorization: 'Basic Y2Fycmllcl90ZXN0OnRlc3RfY2Fycmllcg==',
    },
  })
    
};


// ==== инициализация ==========//
    // axios({
    //   method: 'post',
    //   url: 'https://busis.eu/gds-control/api/v1/search',
    //   headers: {
    //     Authorization: 'Basic Y2Fycmllcl90ZXN0OnRlc3RfY2Fycmllcg==',
    //   },
    //   data: {
    //     id: '6d4467a8-e4d1-441b-bf36-dd5d76021eae',
    //     lang: 'RU',
    //     localityPairs: [['2498710', '2498575']],
    //     dates: ['2020-05-20'],
    //     currency: 'UAH',
    //     maxConnections: 0,
    //   },
    // })
    //   .then(({ data }) => this.setState({ id: data.searchId }))
    //   .catch(err => console.log(err));

        // ============поиск маршрута ===============
    // const { id } = this.state;
    // axios({
    //   method: 'get',
    //   url: `https://busis.eu/gds-control/api/v1/search/${id}`,
    //   headers: {
    //     Authorization: 'Basic Y2Fycmllcl90ZXN0OnRlc3RfY2Fycmllcg==',
    //   },
    // })
    //   .then(({ data }) => {
    //     this.setState({ id: data.searchId });
    //   })
    //   .catch(err => console.log(err));