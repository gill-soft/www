import React, { Component } from 'react';
import { getAllStops } from '../../../services/api';
import ListAllLocality from './ListAllLocality';

export default class SearchForm extends Component {
  state = {
    inputValueFrom: '',
    inputValueWhereTo: '',
    inputDate: '',
    data: [],
    isVisible: false,
  };
  componentDidMount() {
    getAllStops()
      .then(({ data }) => this.setState({ data: data }))
      .catch(err => console.log(err));
  }

  // getSearchRouts = () => {};
  handleChange = ({ target }) => {
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  };

  getValue = val => {
    this.setState({ inputValueFrom: val });
  };

  render() {
    console.log(this.state);
    const {
      inputValueFrom,
      inputValueWhereTo,
      inputDate,
      data,
      isVisible,
    } = this.state;
    return (
      <>
        <form>
          <input
            name="inputValueFrom"
            value={inputValueFrom}
            onChange={this.handleChange}
            onClick={() => this.setState({ isVisible: true })}
          ></input>
          <input
            name="inputValueWhereTo"
            value={inputValueWhereTo}
            onChange={this.handleChange}
            onClick={() => this.setState({ isVisible: true })}
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
        {isVisible && <ListAllLocality data={data} getValue={this.getValue} />}
      </>
    );
  }
}
