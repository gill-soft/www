import React, { Component } from 'react';
import { getAllStops } from '../../../services/api';
import ListAllLocality from './ListAllLocality';

export default class SearchForm extends Component {
  state = {
    inputValueFrom: '',
    inputValueWhereTo: '',
    inputDate: '',
    data: [],
    filterData: [],
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
      this.felterData(this.state.inputValueFrom);
    if (prevState.inputValueWhereTo !== this.state.inputValueWhereTo)
      this.felterData(this.state.inputValueWhereTo);
  }

  felterData = value => {
    const {data} = this.state
    const newData = data.filter(item => {
      if (item.type === 'LOCALITY') {
        return (
          item.name.EN.toLowerCase().indexOf(value.trim().toLowerCase()) > -1
        );
      }
    });
    this.setState({filterData: newData})
  };
 
  // ======== получаем значения в input ==================
  handleChange = ({ target }) => {
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  };

  handleClickInput = ({ target }) => {
    this.state.isVisible === false ? this.isVisibleList() : null;

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

  };

  isVisibleList = () => {
    this.setState(prev => ({ isVisible: !prev.isVisible }));
  };

  getValue = val => {
    if (this.state.classToggle === 'from')
      this.setState({ inputValueFrom: val });
    if (this.state.classToggle === 'whereTo')
      this.setState({ inputValueWhereTo: val });
  };

  changeButton = () => {
    const from = this.state.inputValueFrom;
    const whereTo = this.state.inputValueWhereTo;
    this.setState({ inputValueFrom: whereTo });
    this.setState({ inputValueWhereTo: from });
  };

  render() {

    const {
      inputValueFrom,
      inputValueWhereTo,
      inputDate,
      data,
      isVisible,
      classToggle,
      filterData
    } = this.state;
    return (
      <>
        <form>
          <input
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
          <button type="button" onClick={this.getSearchRouts}>
            search
          </button>
        </form>
        {isVisible && (
          <ListAllLocality
            data={ data }
            filterData={filterData}
            getValue={this.getValue}
            classToggle={classToggle}
            isVisibleList={this.isVisibleList}
          />
        )}
      </>
    );
  }
}
