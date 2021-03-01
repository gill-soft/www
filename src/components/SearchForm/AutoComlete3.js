import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import {
  inputValueFrom,
  inputValueTo,
  setFromId,
  setToId,
} from "../../redux/searchForm/searchFormAction";
import styled from "styled-components";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/HomePageMessanges";
import { getCities } from "../../services/api";

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
    description: "Львівська/Українаа",
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
  }
  .MuiFormControl-marginNormal {
    margin: 0;
  }
`;
const StyledAutocomplete = styled(Autocomplete)`
  .MuiFormControl-marginNormal {
    margin: 0;
  }
  .MuiAutocomplete-option[data-focus="true"] {
    background: "blue";
  }
`;


export default function AutoComplete3({id, error}) {
  const [value2, setValue2] = useState({ label: "", code: "34" });
  const [value, setValue] = useState({ label: "", code: "34" });
  const lang = useSelector((state) => state.language);
  const from = useSelector((state) => state.searchForm.from);
  const to = useSelector((state) => state.searchForm.to);
  const dispatch = useDispatch();
  const changeInputFrom = (value) => dispatch(inputValueFrom(value));
  const changeInputTo = (value) => dispatch(inputValueTo(value));
  const fromId = (value) => dispatch(setFromId(value));
  const toId = (value) => dispatch(setToId(value));

  // === state ==== //
  const [options, setOptions] = useState([]);

  const locale = lang === "UA" ? "UK" : lang;

  const clickHa = () => {
    const a = value;
    const b = value2;
    setValue(b);
    setValue2(a);
  };
console.log(value)
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
    
      <StyledAutocomplete
        id="country-select-demo"
        style={{ width: 300 }}
        options={options}
        // classes={{
        //   option: classes.option
        // }}
        autoHighlight
        value={value}
        getOptionLabel={(option) => option.label}
        getOptionSelected={(o, v) => o !== v}
        onChange={(event, value) => setValue(value)}
        renderOption={(option) => (
          <React.Fragment>
            {option.label} ({option.code}) +{option.phone}
          </React.Fragment>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={
                id === "from" ? (
                  <FormattedMessage id="from" />
                ) : (
                  <FormattedMessage id="to" />
                )
              }
            variant="outlined"
            // inputProps={{
            //   ...params.inputProps,
            //   autoComplete: "new-password" // disable autocomplete and autofill
            // }}
          />
        )}
      />
      <button onClick={clickHa}> fffff </button>
      <Autocomplete
        id="country-select-demo"
        style={{ width: 300 }}
        options={options}
        // classes={{
        //   option: classes.option
        // }}
        autoHighlight
        value={value2}
        getOptionLabel={(option) => option.label}
        getOptionSelected={(o, v) => true}
        onChange={(event, value) => setValue2(value)}
        renderOption={(option) => (
          <React.Fragment>
            {option.label} ({option.code}) +{option.phone}
          </React.Fragment>
        )}
        renderInput={(params) => (
          <StyledTextField
            {...params}
            label="Choose a country"
            variant="outlined"
            inputProps={{
              ...params.inputProps,
              autoComplete: "new-password" // disable autocomplete and autofill
            }}
          />
        )}
      />
    </IntlProvider>
  );
}