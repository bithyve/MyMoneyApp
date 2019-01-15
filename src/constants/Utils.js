import moment from "moment";
import ConnectivityTracker from "react-native-connectivity-tracker";

//TODO: Date Format

const getUnixTimeDate = date => {
  const dateTime = new Date(date).getTime();
  const lastUpdateDate = Math.floor(dateTime / 1000);
  return lastUpdateDate;
};

const getUnixToDateFormat = unixDate => {
  return moment.unix(unixDate).format("DD-MM-YYYY HH:mm:ss");
};
const getUnixToNormaDateFormat = unixDate => {
  return moment.unix(unixDate).format("DD-MM-YYYY");
}

//TODO: Network check
let isNetwork;
const onConnectivityChange = (isConnected, timestamp, connectionInfo) => {
  console.log('connection state change');
  isNetwork = isConnected;
};  

ConnectivityTracker.init({
  onConnectivityChange,
  attachConnectionInfo: false,
  onError: msg => console.log(msg)
  // verifyServersAreUp: () => store.dispatch(checkOurServersAreUp()),
});

const getNetwork = value => {
  return isNetwork;
};  

module.exports = {
  getUnixTimeDate,
  getUnixToDateFormat,
  getUnixToNormaDateFormat,
  getNetwork  
};
