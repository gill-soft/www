import React, { Component } from 'react';

export default class ListAllLocality extends Component {
  state = {
    dataFilter: [],
  };
  componentDidUpdate(prevProps) {
    if (prevProps.filterData !== this.props.filterData)
      this.setState({ dataFilter: this.props.filterData });
  }

  getVal = ({ target }) => {
    this.props.getValue(target.textContent);
    this.props.isVisibleList();
  };
  render() {
    const { dataFilter } = this.state;
    const { data, classToggle } = this.props;
    return (
      <ul className={`listLocality ${classToggle}`} onClick={this.getVal}>
        {dataFilter.length > 0
          ? dataFilter.map(item => (
              <ListItem key={item.id} item={item} data={data} />
            ))
          : data.map(item => (
              <ListItem key={item.id} item={item} data={data} />
            ))}
      </ul>
    );
  }
}

class ListItem extends Component {
  state = {
    locality: '',
  };

  componentDidMount() {
    const { item, filterData } = this.props;
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
    const { item, getValue } = this.props;
    const { locality, fullLocality } = this.state;
    return <li dangerouslySetInnerHTML={this.createMarkup()} />;
  }
}
