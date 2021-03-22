import React from "react";

const Info = () => {
  return (
    <div style={{ padding: "100px" }}>
      <h3>Полезная информация по бронированию.</h3>{" "}
      <p>
        В случае необходимости перевозчик имеет право без предварительного предупреждения
        изменять указанное в билете посадочное место. У нас СВМ – свободный выбор места.
        Если до отправления больше чем 24 часа, и(или) на рейс больше 10 свободных мест.
        Если билет не будет оплачен в течении 24 часов, бронь будет автоматически
        аннулирована. Если до отправления меньше суток (24 часа) и(или) на рейс меньше 10
        свободных мест, билеты необходимо оплатить в течении 3-х часов после бронирования.
        Фактом подтверждения брони является факт оплаты. Забронированные, но неоплаченные
        билеты не гарантируют места в автобусе!
      </p>
      <h3>Информация по отправлению.</h3>{" "}
      <p>
        На каком автобусе я буду ехать? На рейс отправляется автобус в зависимости от
        количества проданных билетов на ту или иную дату. Заранее узнать марку и номер
        автобуса возможности нет. Детальная информация с маркой, моделью, цветом и номером
        автобуса, а также номером водителя или стюардессы, Вы получите в смс сообщении на
        номер телефона, который был указан при покупке билета. Нашими автобусами
        добираться комфортно, автобусы оборудованы под длительные переезды, оснащены
        полками для багажа и багажниками, удобными и функциональными креслами. В нашем
        автопарке есть автобусы таких моделей: Mercedes Sprinter/ Toyota Caetano Optimo/
        Mercedes O350/ Neoplan 116/ Neoplan 122 Если отправление вашего рейса с 00:01 до
        17:00, то за день до отправления (с 18:00 до 19:00) на ваш номер телефона будет
        отправлено смс сообщение с деталями рейса (телефон водителя или сопровождающего,
        номер, марка и цвет автобуса). Если отправление вашего рейса после 17:00, ожидайте
        смс сообщение в день отправления с 13:00 до 14:00. Важно! Если едет большой
        автобус, то время прибытия может изменится в сторону увеличения.{" "}
      </p>
      <h3>Пассажир застрахован!</h3>
      <p>
        Вид страхования: обязательное личное страхование от несчастных случаев на
        транспорте. Оплатив услугу перевозки, пассажир дал согласие, которое
        приравнивается к письменному, на обработку его данных, с целью предоставления
        услуг по перевозке автомобильным транспортом и принял условия договора публичной
        оферты перевозчика. И согласился с правилами и условиями перевозки.
      </p>
    </div>
  );
};

export default Info;
