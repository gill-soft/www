import React, { Component } from 'react';

export default class ListAllLocality extends Component {
  state = {
    dataFilter: [],
  };
  componentDidMount() {
      const {filteredData} = this.props
      this.setState({dataFilter: filteredData })
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.filteredData !== this.props.filteredData)
      this.setState({ dataFilter: this.props.filteredData });
  }

  getVal = ({ target }) => {
    const value =
      target.nodeName === 'LI' ? target.firstChild.innerHTML : target.innerHTML;
    this.props.getValue(value);
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

class ListItem extends Component {
  state = {
    locality: '',
  };

  componentDidMount() {
    const { item } = this.props;
    if (item.type === 'LOCALITY')
      this.setState({ locality: this.getLocality(item) });
  }

  getLocality(item) {
    return `<span class="www">${item.name.EN}</span> - ${this.full(
      item,
      item.parent.id,
    )}`;
  }
  full(obj, id) {
    const { data } = this.props;

    if (!obj.parent.id) return;
    const [result] = data.filter(el => el.id === id);
    if (!result?.parent) {
      return result.name.EN;
    } else {
      return result.name.EN + '/' + this.full(result, result.parent.id);
    }
  }
  createMarkup() {
    const { locality } = this.state;
    return { __html: `${locality}` };
  }

  render() {
    return <li className="li" dangerouslySetInnerHTML={this.createMarkup()} />;
  }
}
