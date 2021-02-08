import React, { Component } from "react";
import { connect } from "react-redux";
import { changeLanguage } from "../../redux/Language/LanguageAction";
import styles from './LanguageSelect.module.css'

class LanguageSelect extends Component {
  handleChange = ({ target }) => {
    this.props.onChangeLanguage(target.value);
  };
  render() {
    return (
      <div className={styles.selectBox}>
        <select
          className={styles.select}
          value={this.props.language}
          onChange={this.handleChange}
        >
          <option className={styles.option} value="RU">Руский</option>
          <option className={styles.option} value="EN">English</option>
          <option className={styles.option} value="UA">Українська</option>
          <option className={styles.option} value="PL">Polski</option>
        </select>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  language: state.language,
});
const mapDispatchToProps = (dispatch) => ({
  onChangeLanguage: (value) => dispatch(changeLanguage(value)),
});
export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelect);
