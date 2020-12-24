import React, { Component } from 'react';
import ListItem from './ListItem';

export default class ListAllLocality extends Component {
  state = {
    dataFilter: [],
  };
  componentDidMount() {
    const { filteredData } = this.props;
    this.setState({ dataFilter: filteredData });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filteredData !== this.props.filteredData)
      this.setState({ dataFilter: this.props.filteredData });
  }
//  ==== передаю значания в инпут ==== //
  getVal = ({ target }) => {
    const value =
      target.nodeName === 'LI' ? target.firstChild.innerHTML : target.innerHTML;
    this.props.getValue(value.trim());
    this.props.isVisibleList();
  };
  render() {
    const { dataFilter } = this.state;
    const { data, classToggle } = this.props;
    return (
      <ul className={`listLocality ${classToggle}`} onClick={this.getVal}>
        {dataFilter.length > 0
          ? dataFilter.map(item => {
              if (item.type === 'LOCALITY') {
                return <ListItem key={item.id} item={item} data={data} />;
              }
            })
          : data.map(item => {
              if (item.type === 'LOCALITY') {
                return <ListItem key={item.id} item={item} data={data} />;
              }
            })}
      </ul>
    );
  }
}
