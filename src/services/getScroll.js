export const getScroll = (w) => {
  if (w < 576) {
    return 400;
  } else if (w >= 576 && w < 768) {
    return 330;
  } else if (w >= 768 && w < 992) {
    return 280;
  } else if (w >= 992 && w < 1200) {
    return 300;
  } else if (w > 1200) {
    return 200;
  }
};
