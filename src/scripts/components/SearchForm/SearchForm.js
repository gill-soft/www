import React, { Component } from 'react';
import { connect } from 'react-redux';
import { searchTrips, getInitialization } from '../../../services/api';
import ListAllLocality from './ListAllLocality';
import { fetchStops } from '../../../redux/searchForm/searchFormOperation';
import {
  inputValueFrom,
  inputValueTo,
  getFilteredStops,
} from '../../../redux/searchForm/searchFormAction';

class SearchForm extends Component {
  state = {
    inputDate: this.getCurrentDate(),
    isVisible: false,
    classToggle: '',
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

  //  ==== добавляем в список населенных пунктов класс соответствующий инпуту ====
  handleClickInput = ({ target }) => {
    target.value
      ? this.filterData(target.value)
      : this.props.getFilteredStops([]);

    switch (target.name) {
      case 'from':
        this.setState({ classToggle: 'from' });
        break;
      case 'to':
        this.setState({ classToggle: 'whereTo' });
        break;
      default:
        null;
    }
    !this.state.isVisible ? this.isVisibleList() : null;
  };

  // ==== фильтр населенных пунктов по значению в инпуте и запись в redux ==== //
  filterData = value => {
    const { lang, stops } = this.props;
    const result = stops.filter(item => {
      if (item.type === 'LOCALITY') {
        return (
          item.name[`${lang}`]
            .toLowerCase()
            .indexOf(value.trim().toLowerCase()) > -1
        );
      }
    });
    this.props.getFilteredStops(result);
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
      item.type === 'LOCALITY' ? item.name[`${lang}`] === val : null,
    );
    return result.id;
  };

  // ========== конец поиск маршрутов ==============

  render() {
    const { inputDate, isVisible, classToggle } = this.state;
    const { from, to } = this.props;
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

        {isVisible && (
          <ListAllLocality
            classToggle={classToggle}
            isVisibleList={this.isVisibleList}
          />
        )}
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
});
const mapDispatchToProps = dispatch => ({
  fetchStops: () => dispatch(fetchStops()),
  getFilteredStops: arr => dispatch(getFilteredStops(arr)),
  changeInputFrom: value => dispatch(inputValueFrom(value)),
  changeInputTo: value => dispatch(inputValueTo(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);
