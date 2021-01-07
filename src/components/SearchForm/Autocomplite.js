import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { inputValueFrom, inputValueTo } from "../../redux/searchForm/searchFormAction";

const Autocomplite = ({
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
  const [value, setValue] = useState(id==='from' ? from : to);

  const full = useCallback(
    (obj, id) => {
      if (!obj.parent.id) return;
      const [result] = stops.filter((el) => el.id === id);
      if (!result?.parent) {
        return result.name[`${lang}`] || result.name[`EN`];
      } else {
        return (
          (result.name[`${lang}`] || result.name[`EN`]) +
          "/" +
          full(result, result.parent.id)
        );
      }
    },
    [lang, stops]
  );
  const getOptions = useCallback(
    (stops) => {
      var result = stops.reduce((newArr, item) => {
        if (item.type === "LOCALITY") {
          newArr.push(
            `${item.name[`${lang}`] || item.name["EN"]} - ${full(item, item.parent.id)} `
          );
        }
        return newArr;
      }, []);

      return result;
    },
    [full, lang]
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
    <div style={{ width: 300 }}>
      <Autocomplete
        id={id}
        freeSolo
        value={value}
        onChange={(event, value) => handleChange(value)}
        options={options.map((opt) => opt)}
        renderOption={(opt) => (
          <div>
            <span className="www">{opt.split(" - ")[0]}</span>
            <span> - {opt.split(" - ")[1]}</span>
          </div>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={(event) => handleInputChange(event)}
            label={id}
            className="inp"
            margin="normal"
            variant="outlined"
            error={error}
            helperText={error ? "required" : ""}
          />
        )}
      />
    </div>
  );
};
const mapStateToProps = (state) => ({
  stops: state.searchForm.stops,
  lang: state.language,
  from: state.searchForm.from,
  to: state.searchForm.to,
});
const mapDispatchToProps = (dispatch) => ({
  changeInputFrom: (value) => dispatch(inputValueFrom(value)),
  changeInputTo: (value) => dispatch(inputValueTo(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Autocomplite);
