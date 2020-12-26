import React, { Component } from 'react';
import { connect } from 'react-redux';

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
    const { lang } = this.props;

    return `<span class="www">${
      item.name[`${lang}`] || item.name['EN']
    } </span> - ${this.full(item, item.parent.id)}`;
  }

  full(obj, id) {
    const { stops, lang } = this.props;

    if (!obj.parent.id) return;
    const [result] = stops.filter(el => el.id === id);
    if (!result?.parent) {
      return result.name[`${lang}`] || result.name[`EN`];
    } else {
      return (
        (result.name[`${lang}`] || result.name[`EN`]) +
        '/' +
        this.full(result, result.parent.id)
      );
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

const mapStateToProps = state => ({
  lang: state.language,
  stops: state.searchForm.stops,
});

export default connect(mapStateToProps)(ListItem);
