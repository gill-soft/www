import React, { Component } from 'react';
import { connect } from 'react-redux';
import ListItem from './ListItem';
import {
  inputValueFrom,
  inputValueTo,
} from '../../../redux/searchForm/searchFormAction';

class ListAllLocality extends Component {
  state = {
    dataFilter: [],
  };
  componentDidMount() {
    const { filteredStops } = this.props;
    this.setState({ dataFilter: filteredStops });
  }

  componentDidUpdate(prevProps) {
    const { filteredStops } = this.props;

    if (prevProps.filteredStops !== filteredStops)
      this.setState({ dataFilter: filteredStops });
  }
  //  ==== передаю значания в инпут ==== //
  getVal = ({ target }) => {
    const value =
      target.nodeName === 'LI' ? target.firstChild.innerHTML : target.innerHTML;
    if (this.props.classToggle === 'from')
      this.props.changeInputFrom(value.trim());
    if (this.props.classToggle === 'whereTo')
      this.props.changeInputTo(value.trim());

    this.props.isVisibleList();
  };
  render() {
    const { dataFilter } = this.state;
    const { classToggle, stops, filteredStops } = this.props;
    return (
      <ul className={`listLocality ${classToggle}`} onClick={this.getVal}>
        {dataFilter.length > 0
          ? dataFilter.map(item => {
              if (item.type === 'LOCALITY') {
                return <ListItem key={item.id} item={item} data={stops} />;
              }
            })
          : stops.map(item => {
              if (item.type === 'LOCALITY') {
                return <ListItem key={item.id} item={item} data={stops} />;
              }
            })}
      </ul>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.language,
  filteredStops: state.searchForm.filteredStops,
  stops: state.searchForm.stops,
  from: state.searchForm.from,
  to: state.searchForm.to,
});
const mapDispatchToProps = dispatch => ({
  fetchStops: () => dispatch(fetchStops()),
  changeInputFrom: value => dispatch(inputValueFrom(value)),
  changeInputTo: value => dispatch(inputValueTo(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListAllLocality);
