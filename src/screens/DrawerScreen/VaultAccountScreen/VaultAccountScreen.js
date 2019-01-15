import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Alert,
  ImageBackground,
  Dimensions,
  TextInput
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
  Text,
  Input
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { SkypeIndicator } from "react-native-indicators";
import DropdownAlert from "react-native-dropdownalert";
import { Dropdown } from "react-native-material-dropdown";
import DateTimePicker from "react-native-modal-datetime-picker";
import {
  Collapse,
  CollapseHeader,
  CollapseBody
} from "accordion-collapse-react-native";
import moment from "moment";

//TODO: Custome class
import renderIf from "../../../constants/validation/renderIf";
import { colors, images, apiary } from "../../../constants/Constants";
var utils = require("../../../constants/Utils");
const { width, height } = Dimensions.get("screen");

export default class VaultAccountScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      date: moment(new Date()).format("DD-MM-YYYY"),
      days: "0",  
      periodType: "",
      isPeriodTypeDialog: false
    };
  }

  //TODO: Page Life Cycle
  componentDidMount() {
    this.setState({
      date: moment(new Date()).format("DD-MM-YYYY"),
      days: "0",
      daysText: "Total Days"
    });
  }

  showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  handleDatePicked = date => {
    let start = moment(date, "YYYY-MM-DD");
    let end = moment(new Date(), "YYYY-MM-DD");
    //Difference in number of days
    let diff = Math.round((start - end) / (1000 * 60 * 60 * 24));
    this.setState({
      date: moment(date).format("DD-MM-YYYY"),
      days: diff
    });

    this.hideDateTimePicker();
  };

  //TODO: func changeDaysValue
  changeDaysValue(val) {
    let newDate = this.addDays(new Date(), val);
    this.setState({
      date: moment(newDate).format("DD-MM-YYYY"),
      days: val
    });
  }

  addDays(theDate, days) {
    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
  }

  render() {
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
              <Body>
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
              <View style={styles.viewDays}>
                <Text style={{ flex: 3, alignSelf: "center" }}>
                  Days Wise :
                </Text>
                <TextInput
                  name={this.state.days}
                  value={this.state.days}
                  placeholder="Total Days"
                  keyboardType={"numeric"}
                  placeholderTextColor="#000"
                  style={styles.input}
                  onChangeText={val => this.changeDaysValue(val)}
                  onChange={val => this.changeDaysValue(val)}
                />
              </View>
              <View style={styles.viewDateWise}>
                <Text style={{ flex: 3, alignSelf: "center" }}>Date Wise:</Text>
                <DateTimePicker
                  isVisible={true}
                  mode={"date"}
                  minimumDate={new Date()}
                  date={this.state.date}
                  onDateChange={this.handleDatePicked.bind(this)}
                  onConfirm={this.handleDatePicked.bind(this)}
                />
              </View>

              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 3 }} />
                <View style={{ flex: 8 }}>
                  <Text
                    style={{ alignSelf: "center", textAlign: "center" }}
                    note
                  >
                    Date: {this.state.date} / Days : {this.state.days}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.viewBtnNext}>
              <Button
                style={[
                  styles.btnSent,
                  { backgroundColor: this.state.sentBtnColor, borderRadius: 5 }
                ]}
                full
                disabled={this.state.sentBtnStatus}
                onPress={() => this.click_SentMoney()}
              >
                <Text> NEXT </Text>
              </Button>
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
  viewContent: {
    flex: 1
  },
  //View:logoSecureAccount
  logoSecureAccount: {
    flex: 2.5,
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
    flex: 2,
    padding: 10
  },
  viewDays: {
    flexDirection: "row"
  },
  //input:days
  input: {
    flex: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    color: "#000"
  },
  //view:datewise
  viewDateWise: {
    flexDirection: "row"
  },
  //view:viewBtnNext
  viewBtnNext: {
    flex: 0.4,
    padding: 20
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.8,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center"
  }
});
