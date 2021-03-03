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
import { messages } from "../../intl/HomePageMessanges";
import { getCities } from "../../services/api";
import { ReactComponent as Arrow } from "../../images/sync_alt-white-36dp.svg";
import styles from "./SearchForm.module.css";

const filterOptions = createFilterOptions({
  matchFrom: "start",
});

const INITIAL_STATE = [
  {
    lang: "RU",
    value: "2498204",
    text: "Харків",
    description: "Харківська/Україна",
  },
  {
    lang: "RU",
    value: "2498710",
    text: "Київ",
    description: "Україна",
  },
  {
    lang: "RU",
    value: "2498389",
    text: "Львів",
    description: "Львівська/Україна",
  },
  {
    lang: "RU",
    value: "2498336",
    text: "Одеса",
    description: "Одеська/Україна",
  },
];

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
    font-size: 18px;
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
`;
// const StyledAutocomplete = styled(Autocomplete)`
//   /* .MuiFormControl-marginNormal {
//     margin: 0;
//   }
//   .MuiAutocomplete-option {
//     /* white-space: wrap; */
//     font-size: 12px;
//     padding: 0;
//     margin: 0;
//     line-height: 1;
// }
//   .MuiAutocomplete-option[data-focus="true"] {
//     background-color: "blue" !important;
//   } */
// `;

const AutoComplete3 = () => {
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

  const [options, setOptions] = useState(INITIAL_STATE);

  const locale = lang === "UA" ? "UK" : lang;

  const handleChange = () => {
    const a = from;
    const b = to;
    setFrom(b);
    setTo(a);
  };

  const getOtpions = (target) => {
    if (target.value === null || target.value === undefined) return;
    if (target.value.length >= 2) {
      getCities(target.value, lang).then(({ data }) => {
        setOptions(data);
      });
    } else {
      setOptions(INITIAL_STATE);
    }
  };

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={styles.inputBox}>
        <Autocomplete
          id="from"
          options={options}
          autoHighlight
          value={from}
          open={isOpenFrom}
          filterOptions={filterOptions}
          getOptionLabel={(option) => option.text}
          getOptionSelected={(o, v) => o !== v}
          onChange={(event, value) => {
            setFrom(value);
            changeIsOpenFrom(false);
            changeIsOpenTo(true);
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
              onMouseDown={({ target }) => {
                getOtpions(target);
                changeIsOpenFrom(true);
                changeIsOpenTo(false);
              }}
              onChange={({ target }) => {
                getOtpions(target);
                changeIsOpenFrom(true);
                changeIsOpenTo(false);
              }}

            />
          )}
        />
      </div>

      <Arrow className={styles.arrow} onClick={handleChange} />
      <div className={styles.inputBox}>
        <Autocomplete
          id="to"
          options={options}
          autoHighlight
          value={to}
          open={isOpenTo}
          filterOptions={filterOptions}
          getOptionLabel={(option) => option.text}
          getOptionSelected={(o, v) => o !== v}
          onChange={(event, value) => {
            setTo(value);
            changeIsOpenTo(false);
            changeIsOpenDate(true);
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
              onMouseDown={({ target }) => {
                getOtpions(target);
                changeIsOpenTo(true);
                changeIsOpenFrom(false);
                changeIsOpenDate(false);
              }}
              onChange={({ target }) => {
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
export default AutoComplete3;
