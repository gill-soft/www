import React from "react";
import SearchForm from "../components/SearchForm/SearchForm";

const HomePage = ({ history, fetchStops }) => {
  return (
    <div>
      <SearchForm history={history} />
    </div>
  );
};

export default HomePage;
