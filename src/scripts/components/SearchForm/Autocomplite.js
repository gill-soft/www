import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  inputValueFrom,
  inputValueTo,
} from '../../../redux/searchForm/searchFormAction';
import { Typography } from '@material-ui/core';

const Autocomplite = ({
  id,
  stops,
  lang,
  changeInputFrom,
  changeInputTo,
  from,
  to,
}) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions(getOptions(stops, lang));
  }, [stops, lang]);

  const getOptions = stops => {
    var result = stops.reduce((newArr, item) => {
      if (item.type === 'LOCALITY') {
        newArr.push(
          `${item.name[`${lang}`] || item.name['EN']} - ${full(
            item,
            item.parent.id,
          )}`,
        );
      }
      return newArr;
    }, []);

    return result;
  };

  const full = (obj, id) => {
    if (!obj.parent.id) return;
    const [result] = stops.filter(el => el.id === id);
    if (!result?.parent) {
      return result.name[`${lang}`] || result.name[`EN`];
    } else {
      return (
        (result.name[`${lang}`] || result.name[`EN`]) +
        '/' +
        full(result, result.parent.id)
      );
    }
  };
  const handleChange = value => {
    let val = value ? value.split(' -')[0] : null;
    id === 'from' ? changeInputFrom(val) : changeInputTo(val);
  };
  //   const inputValue = () => {
  //    if(id === 'from') return  from.split('-')[0].trim

  //   };

  return (
    <div style={{ width: 300 }}>
      <Autocomplete
        id={id}
        freeSolo
        onChange={(event, value) => handleChange(value)}
        options={options.map(opt => opt)}
        renderOption={option => (
          <Typography color="primary" variant="body1">
            {option}
          </Typography>
        )}
        renderInput={params => (
          <TextField
            {...params}
            label={id}
            margin="normal"
            variant="outlined"
          />
        )}
      />
    </div>
  );
};
const mapStateToProps = state => ({
  stops: state.searchForm.stops,
  lang: state.language,
  from: state.searchForm.from,
  to: state.searchForm.to,
});
const mapDispatchToProps = dispatch => ({
  changeInputFrom: value => dispatch(inputValueFrom(value)),
  changeInputTo: value => dispatch(inputValueTo(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Autocomplite);
