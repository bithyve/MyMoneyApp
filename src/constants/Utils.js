import moment from "moment";

//TODO: Date Format

const getUnixTimeDate = date => {
  const dateTime = new Date(date).getTime();
  const lastUpdateDate = Math.floor(dateTime / 1000);
  return lastUpdateDate;
};

const getUnixToDateFormat = unixDate => {
  return moment.unix(unixDate).format("DD-MM-YYYY HH:mm:ss");
};
  
module.exports = {
  getUnixTimeDate,
  getUnixToDateFormat
};
