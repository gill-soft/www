import React, { Component } from 'react';
import { connect } from 'react-redux';
import ListItem from './ListItem';
import {
  inputValueFrom,
  inputValueTo,
  toggleIsVisible,
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
    if (this.props.className === 'from')
      this.props.changeInputFrom(value.trim());
    if (this.props.className === 'whereTo')
      this.props.changeInputTo(value.trim());

    this.props.toggleIsVisible();
  };
  render() {
    const { dataFilter } = this.state;
    const { stops, className } = this.props;
    return (
      <ul className={`listLocality ${className}`} onClick={this.getVal}>
        {dataFilter.length > 0
          ? dataFilter.map(item => {
              if (item.type === 'LOCALITY') {
                return <ListItem key={item.id} item={item} />;
              }
            })
          : stops.map(item => {
              if (item.type === 'LOCALITY') {
                return <ListItem key={item.id} item={item} />;
              }
            })}
      </ul>
    );
  }
}

const mapStateToProps = state => ({
  filteredStops: state.searchForm.filteredStops,
  stops: state.searchForm.stops,
  className: state.searchForm.className,
});
const mapDispatchToProps = dispatch => ({
  changeInputFrom: value => dispatch(inputValueFrom(value)),
  changeInputTo: value => dispatch(inputValueTo(value)),
  toggleIsVisible: () => dispatch(toggleIsVisible()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListAllLocality);
