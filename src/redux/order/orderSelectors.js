import { createSelector } from "reselect";
export const getTicket = (state) => state.order.ticket;

export const getRouts = createSelector(getTicket, (ticket) => {
  const routs = [];
  for (let [key, values] of Object.entries(ticket.segments)) {
    routs.push({ [key]: values });
  }

  return routs.sort((a, b) => {
    const A = new Date(a[Object.keys(a)[0]].departureDate).getTime();
    const B = new Date(b[Object.keys(b)[0]].departureDate).getTime();
    return A - B;
  });
});

export const getAdditionalServicesKeys = createSelector(getTicket, (ticket) => {
  return Array.from(
    new Set(
      ticket.services
        .filter((el) => el.hasOwnProperty("additionalService"))
        .reduce((arr, el) => {
          arr.push(el.additionalService.id);
          return arr;
        }, [])
    )
  );
});

export const getWalletArray = (state) => state.order.wallet;

export const getWalletAmount = createSelector(getWalletArray, (wallet) => {
  const credit = wallet.reduce((summ, el) => {
    return (summ += el.credit);
  }, 0);
  const debit = wallet.reduce((summ, el) => {
    return (summ += el.debit);
  }, 0);
  return credit - debit;
});
