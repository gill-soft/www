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

    return `<span class="www">${item.name[`${lang}`]} </span> - ${this.full(
      item,
      item.parent.id,
    )}`;
  }
  full(obj, id) {
    const { data, lang } = this.props;

    if (!obj.parent.id) return;
    const [result] = data.filter(el => el.id === id);
    if (!result?.parent) {
      return result.name[`${lang}`];
    } else {
      return result.name[`${lang}`] + '/' + this.full(result, result.parent.id);
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
});

export default connect(mapStateToProps)(ListItem);
