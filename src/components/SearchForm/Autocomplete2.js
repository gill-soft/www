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

const AutocompleteComp = ({ id, error }) => {
  // ====redux ====//
  //   const stops = useSelector((state) => state.global.stops);
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

  // ==== формируем популярные города отправки/прибытия ==== //
  useEffect(() => {
    setOptions(INITIAL_STATE.map((el) => `${el.text} - ${el.description} - ${el.value}`));
  }, []);

  // ==== записываем в редакс выбраный город при клике ==== //
  const handleChange = (value) => {
    const val = value ? value.split(" - ")[0].trim() : null;
    const valId = value ? value.split(" - ")[2].trim() : null;
    id === "from" ? changeInputFrom(val) : changeInputTo(val);
    id === "from" ? fromId(valId) : toId(valId);
  };
  // ==== записываем в редакс выбраный город при потере фокуса ==== //
  const handleInputBlur = ({ target }) => {
    const val = target.value ? target.value.split(" - ")[0].trim() : null;
    id === "from" ? changeInputFrom(val) : changeInputTo(val);
  };

  //   ==== если введено больше двух символов получаем новые опшины ====//
  const getOtpions = (target) => {
    id === "from" ? fromId("") : toId("");
    if (target.value.length >= 2)
      getCities(target.value, lang).then(({ data }) => {
        setOptions(data.map((el) => `${el.text} - ${el.description} - ${el.value}`));
      });
    if (target.value.length === 0)
      setOptions(
        INITIAL_STATE.map((el) => `${el.text} - ${el.description} - ${el.value}`)
      );
  };
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div>
        <StyledAutocomplete
          id={id}
          freeSolo
          value={id === "from" ? from : to}
          filterOptions={filterOptions}
          onChange={(event, value) => handleChange(value)}
          onClick={(event, value) => handleChange(value)}
          options={options.map((opt) => opt)}
          renderOption={(opt) => (
            <div>
              <span className="acMainOption">{opt.split(" - ")[0]}</span>
              <span> - {opt.split(" - ")[1]}</span>
            </div>
          )}
          renderInput={(params) => (
            <StyledTextField
              {...params}
              label={
                id === "from" ? (
                  <FormattedMessage id="from" />
                ) : (
                  <FormattedMessage id="to" />
                )
              }
              onChange={({ target }) => getOtpions(target)}
              onMouseDown={({ target }) => getOtpions(target)}
              onBlur={(event) => handleInputBlur(event)}
              margin="normal"
              variant="outlined"
              error={error}
              helperText={error ? "уточните параметры поиска" : ""}
            />
          )}
        />
      </div>
    </IntlProvider>
  );
};

export default AutocompleteComp;
