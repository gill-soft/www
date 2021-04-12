export const getDescription = (lang) => {
  switch (lang) {
    case "UA":
      return "Автобусні квитки для поїздок Україною, Європою та СНД. Великий вибір рейсів. Безкоштовне бронювання та легка покупка. Гарантія повернення коштів за квиток - Veze.ua";
    case "RU":
      return "Автобусные билеты для поездок по Украине, Європе та СНГ. Большой ыбор рейсов. Бесплатное бронирование и легкая покупка.Гарантия возврата денег за билет - VEZE.ua";
    case "EN":
      return "Bus tickets for trips to Ukraine, Europe and the CIS. Large selection of flights. Free booking and easy purchase. Money back guarantee - VEZE.ua";
    case "PL":
      return "Bilety autobusowe na wycieczki do Ukrainy, Europy i WNP. Duży wybór lotów. Bezpłatna rezerwacja i łatwy zakup. Gwarancja zwrotu pieniędzy - VEZE.ua";

    default:
      return "Автобусні квитки для поїздок Україною, Європою та СНД. Великий вибір рейсів. Безкоштовне бронювання та легка покупка. Гарантія повернення коштів за квиток - Veze.ua";
  }
};

export const getTitle = (lang) => {
  switch (lang) {
    case "UA":
      return "Купити квитки на автобус онлайн, квитки на автобус | Veze";
    case "RU":
      return "Купить билеты на автобус онлайн, билеты на автобус |Veze";
    case "EN":
      return "Buy bus tickets online, bus tickets | VEZE.ua";
    case "PL":
      return "Kup bilety autobusowe online, bilety autobusowe | VEZE.ua";

    default:
      return "Купити квитки на автобус онлайн, квитки на автобус | Veze";
  }
};
