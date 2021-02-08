import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import { inputValueFrom, inputValueTo } from "../../redux/searchForm/searchFormAction";
import styled from "styled-components";

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

const AutocompleteComp = ({
  id,
  stops,
  lang,
  changeInputFrom,
  changeInputTo,
  from,
  to,
  error,
}) => {
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState(id === "from" ? from : to);

  // ==== смена инпута при смене языка ==== //
  useEffect(() => {
    if (!value) return;
    const res = stops.find(
      (el) =>
        el.name["RU"] === value ||
        el.name["EN"] === value ||
        el.name["PL"] === value ||
        el.name["UA"] === value
    );
    if (res) {
      setValue(res.name[`${lang}`]);
      id === "from" ? changeInputFrom(value) : changeInputTo(value);
    }
  }, [lang, stops, value, changeInputFrom, changeInputTo, id]);

  useEffect(() => {
    id === "from" ? setValue(from) : setValue(to);
  }, [id, from, to]);

  const getFull = useCallback(
    (obj, id) => {
      if (!obj.parent.id) return;
      const [result] = stops.filter((el) => el.id === id);
      if (!result?.parent) {
        return result.name[`${lang}`] || result.name[`EN`];
      } else {
        return (
          (result.name[`${lang}`] || result.name[`EN`]) +
          "/" +
          getFull(result, result.parent.id)
        );
      }
    },
    [lang, stops]
  );
  const getOptions = useCallback(
    (stops) => {
      return stops.reduce((newArr, item) => {
        if (item.type === "LOCALITY") {
          newArr.push(
            `${item.name[`${lang}`] || item.name["EN"]} - ${getFull(
              item,
              item.parent.id
            )} `
          );
        }
        return newArr;
      }, []);
    },
    [getFull, lang]
  );

  useEffect(() => {
    setOptions(getOptions(stops, lang));
  }, [getOptions, stops, lang]);

  const handleChange = (value) => {
    let val = value ? value.split(" - ")[0] : null;
    setValue(val);
    id === "from" ? changeInputFrom(val) : changeInputTo(val);
  };

  const handleInputChange = ({ target }) => {
    id === "from" ? changeInputFrom(target.value) : changeInputTo(target.value);
  };

  return (
    <div>
      <StyledAutocomplete
        id={id}
        freeSolo
        value={value}
        filterOptions={filterOptions}
        onChange={(event, value) => handleChange(value)}
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
            label={id === "from" ? "откуда" : "куда"}
            onBlur={(event) => handleInputChange(event)}
            margin="normal"
            variant="outlined"
            error={error}
            helperText={error ? "уточните параметры поиска" : ""}
          />
        )}
      />
    </div>
  );
};
const mapStateToProps = (state) => ({
  stops: state.global.stops,
  lang: state.language,
  from: state.searchForm.from,
  to: state.searchForm.to,
});
const mapDispatchToProps = (dispatch) => ({
  changeInputFrom: (value) => dispatch(inputValueFrom(value)),
  changeInputTo: (value) => dispatch(inputValueTo(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AutocompleteComp);
