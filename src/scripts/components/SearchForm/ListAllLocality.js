import React, { Component } from 'react';

class ListItem extends Component {
  state = {
    locality: '',
  };

  componentDidMount() {
    const { item } = this.props;
    if (item.type === 'LOCALITY') {
      this.setState({ locality: this.getLocality(item) });
    }
  }

  getLocality(item) {
    return `<span class="www">${item.name.RU}</span> - ${this.full(
      item,
      item.parent.id,
    )}`;
  }
  full(obj, id) {
    const { data } = this.props;

    if (!obj.parent.id) return;
    const [result] = data.filter(el => el.id === id);
    if (!result.parent) {
      return result.name.RU;
    } else {
      return result.name.RU + '/' + this.full(result, result.parent.id);
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

export default class ListAllLocality extends Component {
  getVal = ({ target }) => {
    this.props.getValue(target.textContent);
  };
  render() {
    const { data } = this.props;
    return (
      <ul className="listLocality" onClick={this.getVal}>
        {data.length > 0 &&
          data.map(item => <ListItem key={item.id} item={item} data={data} />)}
      </ul>
    );
  }
}
