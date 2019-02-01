import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  View,
  ImageBackground,
  TextInput,
  TouchableHighlight
} from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Left,
  Right,
  Body,
  Text
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { SkypeIndicator } from "react-native-indicators";
import DropdownAlert from "react-native-dropdownalert";
import { RkCard } from "react-native-ui-kitten";
import DatePicker from "react-native-datepicker";
import moment from "moment";
import ReactNativeItemSelect from "react-native-item-select";

//TODO: Custome class
import { colors, images } from "../../../../app/constants/Constants";
import renderIf from "../../../../app/constants/validation/renderIf";
var utils = require("../../../../app/constants/Utils");

export default class VaultAccountScreen extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: false,
      date: moment(new Date()).format("DD-MM-YYYY"),
      days: "0",
      periodType: "",
      isPeriodTypeDialog: false
    };
    this.changeDateAndroid = this.changeDateAndroid.bind(this);
  }

  //TODO: Page Life Cycle
  componentDidMount() {
    this.setState({
      date: moment(new Date()).format("DD-MM-YYYY"),
      days: "0",
      daysText: "Total Days"
    });
  }

  //TODO: func changeDaysValue
  changeDaysValue(val) {
    let newDate = this.addDays(new Date(), val);
    this.setState({
      date: moment(newDate).format("DD-MM-YYYY"),
      days: val
    });
  }

  handleDatePicked = date => {
    let start = moment(this.addDays(date, 1), "DD-MM-YYYY");
    let end = moment(new Date(), "DD-MM-YYYY");
    let diff = Math.round((start - end) / (1000 * 60 * 60 * 24));
    console.log("change date =" + diff);
    this.setState({
      date: moment(date).format("DD-MM-YYYY"),
      days: diff.toString()
    });
  };

  changeDateAndroid(date) {
    let start = moment(date, "DD-MM-YYYY");
    let end = moment(new Date(), "DD-MM-YYYY");
    let diff = Math.round((start - end) / (1000 * 60 * 60 * 24));
    this.setState({
      date: date,
      days: diff.toString()
    });
  }

  addDays(theDate, days) {
    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
  }

  //TODO: func click_CreateVaultAccout
  click_CreateVaultAccout(item: any) {
    let newDate = this.addDays(new Date(), item.days.slice(0, 2));
    let unitDate = utils.getUnixTimeDate(newDate);
    let data = {};
    data.validDate = unitDate;

  }

  render() {
    const textStyle = {
      textAlign: "center",
      color: "#696969",
      fontWeight: "bold"
    };
    const data = [
      { months: "3 Months", days: "30 days" },
      { months: "6 Months", days: "60 days" },
      { months: "9 Months", days: "180 days" }
    ];
    return (
      <Container>
        <Content contentContainerStyle={styles.container} scrollEnabled={true}>
          <ImageBackground
            source={images.appBackgound}
            style={styles.backgroundImage}
          >
            <Header transparent>
              <Left>
                <Button transparent onPress={() => this.props.navigation.pop()}>
                  <Icon name="chevron-left" size={25} color="#ffffff" />
                </Button>
              </Left>
              <Body style={{ flex: 0, alignItems: "center" }}>
                <Title />
              </Body>
              <Right />
            </Header>

            <View style={styles.logoSecureAccount}>
              <Image
                style={styles.secureLogo}
                source={images.secureAccount.secureLogo}
              />
              <Text style={styles.txtTitle}>Vault Account</Text>
              <Text style={styles.txtLorem}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s.
              </Text>
            </View>

            <View style={styles.viewSelectPeriod}>
              <ReactNativeItemSelect
                data={data}
                countPerRow={3}
                multiselect={false}
                submitBtnTitle="CREATE"
                styles={{  
                  btn: {
                    backgroundColor: "#2196F3",
                    marginTop: 20,
                    height: 40
                  },
                  disabledBtn: { backgroundColor: "#2196F3" },
                  btnTxt:{fontSize:18},
                  tickTxt: { backgroundColor: "#2196F3" },
                  activeItemBoxHighlight: { borderColor: "#2196F3" }
                }}
                itemComponent={item => (
                  <View>
                    <Text style={{ textStyle, fontSize: 20 }}>
                      {item.months}
                    </Text>
                    <Text style={{ textStyle }}>{item.days}</Text>
                  </View>
                )}
                onSubmit={(item: string) => this.click_CreateVaultAccout(item)}
              />
            </View>
          </ImageBackground>
        </Content>
        {renderIf(this.state.isLoading)(
          <View style={styles.loading}>
            <SkypeIndicator color={colors.appColor} />
          </View>
        )}
        <DropdownAlert ref={ref => (this.dropdown = ref)} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  backgroundImage: {
    flex: 1
  },
  //View:logoSecureAccount
  logoSecureAccount: {
    flex: 4,
    alignItems: "center"
  },
  secureLogo: {
    height: 120,
    width: 120
  },
  txtTitle: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 28
  },
  txtLorem: {
    textAlign: "center",
    marginTop: 10
  },
  //view:viewSelectPeriod
  viewSelectPeriod: {
    flex: 4,
    padding: 10
  }
});
