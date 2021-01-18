import React, { useEffect } from "react";
import { connect } from "react-redux";
import SearchForm from "../components/SearchForm/SearchForm";
import { fetchStops } from "../redux/searchForm/searchFormOperation";

const HomePage = ({ history, fetchStops }) => {

  //  ==== получаем все остановки через redux ==== //
  useEffect(() => {
    fetchStops();
  }, [fetchStops]);
  
  return (
    <div>
      <SearchForm history={history} />
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  fetchStops: () => dispatch(fetchStops()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
