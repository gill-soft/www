import React, { Component } from 'react';
import { connect } from 'react-redux';
import { searchTrips, getInitialization } from '../../../services/api';
import ListAllLocality from './ListAllLocality';
import { fetchStops } from '../../../redux/searchForm/searchFormOperation';
import {
  inputValueFrom,
  inputValueTo,
  getFilteredStops,
  getClassName,
  toggleIsVisible,
} from '../../../redux/searchForm/searchFormAction';

class SearchForm extends Component {
  state = {
    inputDate: this.getCurrentDate(),
  };

  //  ==== получаем все остановки через redux ==== //
  componentDidMount() {
    this.props.fetchStops();
  }

  componentDidUpdate(prevPops) {
    const { from, to } = this.props;
    if (prevPops.from !== from) this.filterData(from);
    if (prevPops.to !== to) this.filterData(to);
  }

  getCurrentDate() {
    return `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${
      new Date().getDate() + 2
    }`;
  }

  // ==== фильтр населенных пунктов по значению в инпуте и запись в redux ==== //
  filterData = value => {
    const { lang, stops } = this.props;
    const result = stops.filter(item => {
      if (item.type === 'LOCALITY') {
        return (
          (item.name[`${lang}`] || item.name['EN'])
            .toLowerCase()
            .indexOf(value.trim().toLowerCase()) > -1
        );
      }
    });
    this.props.getFilteredStops(result);
  };

  //  ==== добавляем в список населенных пунктов класс соответствующий инпуту ====
  handleClickInput = ({ target }) => {
    target.value
      ? this.filterData(target.value)
      : this.props.getFilteredStops([]);

    if (target.name === 'from') this.props.getClassName('from');
    if (target.name === 'to') this.props.getClassName('whereTo');

    !this.props.isVisible ? this.props.toggleIsVisible() : null;
  };

  // ==== поменять отправку и прибытие местами ==== //
  changeButton = () => {
    const from = this.props.from;
    const to = this.props.to;
    this.props.changeInputFrom(to);
    this.props.changeInputTo(from);
  };

  //  ==== запись значения  input в redux ==== //
  handleChange = ({ target }) => {
    if (target.name === 'from') this.props.changeInputFrom(target.value);
    if (target.name === 'to') this.props.changeInputTo(target.value);
  };

  // ==== переключатель отображения списка населенных пунктов ==== //
  isVisibleList = () => {
    this.setState(prev => ({ isVisible: !prev.isVisible }));
  };

  // ==========================================
  // ========== поиск маршрутов ==============
  handleClickSearch = e => {
    this.searchTrips(e);
  };

  searchTrips = e => {
    e.preventDefault();
    const requestData = {
      idFrom: this.getId(this.props.from.trim()),
      idWhereTo: this.getId(this.props.to.trim()),
      date: this.state.inputDate,
    };
    getInitialization(requestData)
      .then(({ data }) => this.searchRouts(data.searchId))
      .catch(err => console.log(err));
  };

  searchRouts = id => {
    console.log('startFechRouts');
    setTimeout(() => {
      if (!id) return;

      searchTrips(id).then(({ data }) => {
        data.searchId
          ? this.searchRouts(data.searchId)
          : console.log('data', data);
      });
    }, 300);
  };

  getId = val => {
    const { lang, stops } = this.props;
    const [result] = stops.filter(item =>
      item.type === 'LOCALITY'
        ? (item.name[`${lang}`] || item.name['EN']).toLowerCase() ===
          val.toLowerCase().trim()
        : null,
    );
    return result.id;
  };

  // ========== конец поиск маршрутов ==============

  render() {
    const { inputDate } = this.state;
    const { from, to, isVisible } = this.props;
    return (
      <>
        <form onSubmit={this.searchTrips}>
          <input
            type="text"
            name="from"
            value={from}
            onChange={this.handleChange}
            onClick={this.handleClickInput}
            autoComplete="off"
          ></input>
          <button type="button" onClick={this.changeButton}>
            &hArr;
          </button>
          <input
            type="text"
            name="to"
            value={to}
            onChange={this.handleChange}
            onClick={this.handleClickInput}
            autoComplete="off"
          ></input>
          <input
            name="inputDate"
            value={inputDate}
            type="date"
            onChange={this.handleChange}
          ></input>

          <button type="submit" onClick={this.handleClickSearch}>
            search
          </button>
        </form>

        {isVisible && <ListAllLocality />}
      </>
    );
  }
}
const mapStateToProps = state => ({
  lang: state.language,
  stops: state.searchForm.stops,
  filteredStops: state.searchForm.filteredStops,
  from: state.searchForm.from,
  to: state.searchForm.to,
  isVisible: state.searchForm.isVisible,
});
const mapDispatchToProps = dispatch => ({
  fetchStops: () => dispatch(fetchStops()),
  getFilteredStops: arr => dispatch(getFilteredStops(arr)),
  changeInputFrom: value => dispatch(inputValueFrom(value)),
  changeInputTo: value => dispatch(inputValueTo(value)),
  getClassName: value => dispatch(getClassName(value)),
  toggleIsVisible: () => dispatch(toggleIsVisible()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);
