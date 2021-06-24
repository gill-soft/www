import Offerta from "../assets/Oferta_VZ.pdf";
import Offerta_ru from "../assets/Oferta_VZ_ru.pdf";
import Offerta_en from "../assets/Oferta_VZ_en.pdf";
import Offerta_pl from "../assets/Oferta_VZ_pl.pdf";

import Pk from "../assets/pk_VZ.pdf";
import Pk_ru from "../assets/pk_VZ_ru.pdf";
import Pk_en from "../assets/pk_VZ_en.pdf";
import Pk_pl from "../assets/pk_VZ_pl.pdf";

export const getPk = (lang) => {
  let pdfFile;
  switch (lang) {
    case "UA":
      pdfFile = Pk;
      break;
    case "RU":
      pdfFile = Pk_ru;
      break;
    case "EN":
      pdfFile = Pk_en;
      break;
    case "PL":
      pdfFile = Pk_pl;
      break;
    default:
      pdfFile = Pk;
      break;
  }
  return pdfFile;
};
export const getOfferta = (lang) => {
  let pdfFile;
  switch (lang) {
    case "UA":
      pdfFile = Offerta;
      break;
    case "RU":
      pdfFile = Offerta_ru;
      break;
    case "EN":
      pdfFile = Offerta_en;
      break;
    case "PL":
      pdfFile = Offerta_pl;
      break;
    default:
      pdfFile = Offerta;
      break;
  }
  return pdfFile;
};
