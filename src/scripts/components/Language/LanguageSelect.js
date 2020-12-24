import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeLanguage } from '../../../redux/Language/LanguageAction';

class LanguageSelect extends Component {
  handleChange = ({ target }) => {
    this.props.onChangeLanguage(target.value);
  };
  render() {
    return (
      <div>
        <select
          className="select-css"
          value={this.props.language}
          onChange={this.handleChange}
        >
          <option value="EN">English</option>
          <option value="RU">Руский</option>
          <option value="UA">Українська</option>
          <option value="PL">Polski</option>
        </select>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  language: state.language,
});
const mapDispatchToProps = dispatch => ({
  onChangeLanguage: value => dispatch(changeLanguage(value)),
});
export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelect);
