import React, { Component } from 'react';
import { getAllStops } from '../../../services/api';

export default class SearchForm extends Component {
  state = {
    inputValueFrom: '',
    inputValueWhereTo: '',
    inputDate: '',
    data: [],
  };
  componentDidMount() {
    getAllStops()
      .then(({ data }) => this.setState({ data: data }))
      .catch(err => console.log(err));
  }

  getSearchRouts = () => {};
  handleChange = ({ target }) => {
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  };

  render() {
    console.log(this.state);
    const { inputValueFrom, inputValueWhereTo, inputDate } = this.state;
    return (
      <form>
        <input
          name="inputValueFrom"
          value={inputValueFrom}
          onChange={this.handleChange}
        ></input>
        <input
          name="inputValueWhereTo"
          value={inputValueWhereTo}
          onChange={this.handleChange}
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
      <ListAllLocality />
    );
  }
}
