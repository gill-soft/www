import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import {
  inputValueFrom,
  inputValueTo,
  setIsOpenDate,
  setIsOpenFrom,
  setIsOpenTo,
} from "../../redux/searchForm/searchFormAction";
import styled from "styled-components";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/HomePageMessages";
import { getCities } from "../../services/api";
import { ReactComponent as Arrow } from "../../images/sync_alt-white-36dp.svg";
import styles from "./SearchFormBaner.module.css";
import { OPTIONS } from "../../assets/searchFormOptions";
import { withStyles } from "@material-ui/core/styles";

const filterOptions = createFilterOptions({
  matchFrom: "start",
});

const StyledTextField = styled(TextField)`
  label {
    color: var(--color-secondary);
  }
  label.Mui-focused {
    color: var(--color-secondary);
  }
  .MuiOutlinedInput-root {
    fieldset {
      border: 2px solid var(--color-secondary);
    }
    &:hover fieldset {
      border: 3px solid var(--color-secondary);
    }
    &.Mui-focused fieldset {
      border: 3px solid var(--color-secondary);
    }
  }
  .MuiInputBase-input {
    color: #ffffff;
    font-family: "HelveticaNeueCyr";
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
  }
  .MuiIconButton-root {
    color: var(--color-secondary);
    display: none;
  }
  .MuiAutocomplete-popupIndicator {
    display: none;
  }
  .MuiFormControl-marginNormal {
    margin: 0;
  }
  .MuiFormLabel-root {
    font-family: "HelveticaNeueCyr";
  }
`;
const StyledAutoComplete = withStyles({
  paper: {
    fontSize: window.innerWidth >= 992 ? "16px !important" : "14px !important",
  },
  inputRoot: {
    paddingRight: "10px !important",
    cursor: "pointer"
  },
  input:{
    padding:  "9.5px 0 9.5px 4px !important",
    fontSize: window.innerWidth >= 992 ? "16px !important" : "14px !important",
  }
})(Autocomplete);

const AutoComplete = () => {
  const lang = useSelector((state) => state.language);
  const from = useSelector((state) => state.searchForm.from);
  const to = useSelector((state) => state.searchForm.to);
  const isOpenFrom = useSelector((state) => state.searchForm.isOpenFrom);
  const isOpenTo = useSelector((state) => state.searchForm.isOpenTo);
  const dispatch = useDispatch();
  const setFrom = (value) => dispatch(inputValueFrom(value));
  const setTo = (value) => dispatch(inputValueTo(value));
  const changeIsOpenFrom = (bool) => dispatch(setIsOpenFrom(bool));
  const changeIsOpenTo = (bool) => dispatch(setIsOpenTo(bool));
  const changeIsOpenDate = (bool) => dispatch(setIsOpenDate(bool));

  const [options, setOptions] = useState(OPTIONS[lang]);
  const [anime, setAnime] = useState(false);

  const locale = lang === "UA" ? "UK" : lang;

  const handleChange = () => {
    const a = from;
    const b = to;
    setFrom(b);
    setTo(a);
    setAnime(!anime);
  };

  const getOtpions = (target) => {
    setOptions([]);
    if (target.value === null || target.value === undefined) return;
    if (target.value.length >= 2) {
      getCities(target.value, lang).then(({ data }) => {
        setOptions(data);
      });
    } else {
      setOptions(OPTIONS[lang]);
    }
  };
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={styles.inputBox}>
        <StyledAutoComplete
          // id="from"
          options={options}
          noOptionsText=""
          autoHighlight
          value={from}
          open={isOpenFrom}
          blurOnSelect={true}
          filterOptions={filterOptions}
          getOptionLabel={(option) => option.text}
          getOptionSelected={(o, v) => o !== v}
          onChange={(event, value) => {
            if (value) {
              setFrom(value);
              changeIsOpenFrom(false);
              setTimeout(() => {
                changeIsOpenTo(true);
              }, 0);
            } else {
              setFrom({ text: "", value: "" });
              changeIsOpenFrom(true);
              setTimeout(() => {
                changeIsOpenTo(false);
              }, 0);
            }
            setOptions(OPTIONS[lang]);
          }}
          renderOption={(option) => (
            <div>
              <span className="acMainOption">{option.text}</span>
              <span> - {option.description}</span>
            </div>
          )}
          renderInput={(params) => (
            <StyledTextField
              {...params}
              label={<FormattedMessage id="from" />}
              variant="outlined"
              onFocus={({ target }) => {
                getOtpions(target);
                changeIsOpenFrom(true);
                changeIsOpenTo(false);
              }}
              onChange={({ target }) => {
                getOtpions(target);
                changeIsOpenFrom(true);
                changeIsOpenTo(false);
              }}
              onBlur={() => {
                changeIsOpenFrom(false);
              }}
            />
          )}
        />
        <Arrow
          className={` ${anime ? styles.arrowClick : styles.arrow}`}
          onClick={handleChange}
        />
      </div>

      <div className={styles.inputBox}>
        <StyledAutoComplete
          // id="to"
          options={options}
          noOptionsText=""
          autoHighlight
          value={to}
          open={isOpenTo}
          blurOnSelect={true}
          filterOptions={filterOptions}
          getOptionLabel={(option) => option.text}
          getOptionSelected={(o, v) => o !== v}
          onChange={(event, value) => {
            value ? setTo(value) : setTo({ text: "", value: "" });
            value !== null ? changeIsOpenTo(false) : changeIsOpenTo(true);
            setOptions(OPTIONS[lang]);
            if (value !== null) changeIsOpenDate(true);
          }}
          renderOption={(option) => (
            <div>
              <span className="acMainOption">{option.text}</span>
              <span> - {option.description}</span>
            </div>
          )}
          renderInput={(params) => (
            <StyledTextField
              {...params}
              label={<FormattedMessage id="to" />}
              variant="outlined"
              onChange={({ target }) => {
                getOtpions(target);
                changeIsOpenTo(true);
                changeIsOpenFrom(false);
                changeIsOpenDate(false);
              }}
              onBlur={() => {
                changeIsOpenTo(false);
              }}
              onFocus={({ target }) => {
                getOtpions(target);
                changeIsOpenTo(true);
                changeIsOpenFrom(false);
                changeIsOpenDate(false);
              }}
            />
          )}
        />
      </div>
    </IntlProvider>
  );
};
export default AutoComplete;
