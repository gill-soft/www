import { FormattedMessage } from "react-intl";

export const changeError = (value) => {
  switch (value) {
    case "Order is not payed":
      return <FormattedMessage id="errorPayed" />;
    case "Can not find order":
      return <FormattedMessage id="errorOrder" />;
    case "Can not find payment transaction":
      return <FormattedMessage id="errorTransaction" />;

    default:
      return <FormattedMessage id="errorError" />;
  }
};
