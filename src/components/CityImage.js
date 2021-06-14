import React, { useState, useEffect } from "react";

const CityImage = ({ id }) => {
  const [img, setImg] = useState("");
  useEffect(() => {
    getImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getImage = () => {
    if (id) import(`../images/cities/${id}.jpg`).then((img) => setImg(img.default));
  };
  return <img width={"310px"} height={"200px"} src={img} alt={`квитки онлайн в `}></img>;
};

export default CityImage;
