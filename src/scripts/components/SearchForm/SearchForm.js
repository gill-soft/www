import React, { Component } from 'react';
import {
  getAllStops,
  searchTrits,
  getInitialization,
} from '../../../services/api';
import ListAllLocality from './ListAllLocality';

export default class SearchForm extends Component {
  state = {
    data: [],
    inputValueFrom: '',
    inputValueWhereTo: '',
    inputDate: '',
    filteredData: [],
    isVisible: false,
    classToggle: '',
  };

  componentDidMount() {
    getAllStops()
      .then(({ data }) => this.setState({ data: data }))
      .catch(err => console.log(err));
  }

  componentDidUpdate(prevPops, prevState) {
    if (prevState.inputValueFrom !== this.state.inputValueFrom)
      this.filterData(this.state.inputValueFrom);
    if (prevState.inputValueWhereTo !== this.state.inputValueWhereTo)
      this.filterData(this.state.inputValueWhereTo);
  }

  //  ==== получить значение в соответствующий инпут  ==== //
  getValue = val => {
    if (this.state.classToggle === 'from')
      this.setState({ inputValueFrom: val });
    if (this.state.classToggle === 'whereTo')
      this.setState({ inputValueWhereTo: val });
  };

  //  ==== добавляем в список населенных пунктов класс соответствующий инпуту ====
  handleClickInput = ({ target }) => {
    target.value
      ? this.filterData(target.value)
      : this.setState({ filteredData: [] });

    switch (target.name) {
      case 'inputValueFrom':
        this.setState({ classToggle: 'from' });
        break;
      case 'inputValueWhereTo':
        this.setState({ classToggle: 'whereTo' });
        break;
      default:
        null;
    }
    this.state.isVisible === false ? this.isVisibleList() : null;
  };

  // ==== фильтр населенных пунктов по значению в инпуте ==== //
  filterData = value => {
    const { data } = this.state;
    const newData = data.filter(item => {
      if (item.type === 'LOCALITY') {
        return (
          item.name.EN.toLowerCase().indexOf(value.trim().toLowerCase()) > -1
        );
      }
    });
    this.setState({ filteredData: newData });
  };

  // ==== поменять отправку и прибытие местами ==== //
  changeButton = () => {
    const from = this.state.inputValueFrom;
    const whereTo = this.state.inputValueWhereTo;
    this.setState({ inputValueFrom: whereTo });
    this.setState({ inputValueWhereTo: from });
  };

  //  ==== контролируемый инпут ==== //
  handleChange = ({ target }) => {
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  };
  // ==== переключатель отображения списка населенных пунктов ==== //
  isVisibleList = () => {
    this.setState(prev => ({ isVisible: !prev.isVisible }));
  };

  // ========== поиск маршрутов ==============
  handleClickSearch = e => {
    this.searchTrips(e);
  };

  searchTrips = e => {
    e.preventDefault();
    const requestData = {
      idFrom: this.getId(this.state.inputValueFrom),
      idWhereTo: this.getId(this.state.inputValueWhereTo),
      date: this.state.inputDate,
    };
    getInitialization(requestData).then(({ data }) =>
      this.searchRouts(data.searchId),
    );

    this.getId(this.state.inputValueFrom);
  };

  searchRouts = id => {
    if (id) {
      searchTrits(id).then(({ data }) => {
        console.log(data);
        this.searchRouts(data.searchId);
      });
    }
  };

  getId = val => {
    const { data } = this.state;
    const [res] = data.filter(item =>
      item.type === 'LOCALITY' ? item.name.EN === val : null,
    );
    return res.id;
  };

  // ========== конец исправить завтра ==============

  render() {
    const {
      inputValueFrom,
      inputValueWhereTo,
      inputDate,
      data,
      isVisible,
      classToggle,
      filteredData,
    } = this.state;
    return (
      <>
        <form onSubmit={this.searchTrips}>
          <input
            type="text"
            name="inputValueFrom"
            value={inputValueFrom}
            onChange={this.handleChange}
            onClick={this.handleClickInput}
            autoComplete="off"
          ></input>
          <button type="button" onClick={this.changeButton}>
            &hArr;
          </button>
          <input
            type="text"
            name="inputValueWhereTo"
            value={inputValueWhereTo}
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
            data={data}
            filteredData={filteredData}
            getValue={this.getValue}
            classToggle={classToggle}
            isVisibleList={this.isVisibleList}
          />
        )}
      </>
    );
  }
}
