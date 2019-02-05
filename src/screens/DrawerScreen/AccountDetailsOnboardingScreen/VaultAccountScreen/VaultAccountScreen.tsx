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
//Custome Compontes
import SCLAlertOk from "../../../../app/custcompontes/alert/SCLAlertOk";
//TODO: Custome class
import { colors, images, localDB } from "../../../../app/constants/Constants";
import renderIf from "../../../../app/constants/validation/renderIf";
var utils = require("../../../../app/constants/Utils");
var dbOpration = require("../../../../app/manager/database/DBOpration");

//TODO: VaultAccount
import vaultAccount from "../../../../bitcoin/services/VaultAccount";

export default class VaultAccountScreen extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: false,
      date: moment(new Date()).format("DD-MM-YYYY"),
      days: "0",
      periodType: "",
      alertPopupData: [],
      isPeriodTypeDialog: false,
      data: [
        { months: "3 Months", days: "30 days" },
        { months: "6 Months", days: "60 days" },
        { months: "9 Months", days: "180 days" }
      ]
    };
  }

  addDays(theDate, days) {
    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
  }

  //TODO: func click_CreateVaultAccout
  async click_CreateVaultAccout(item: any) {
    let newDate = this.addDays(new Date(), item.days.slice(0, 2));
    let unitDate = utils.getUnixTimeDate(newDate);
    let data = {};
    data.validDate = unitDate;
    data.sec = item.days.slice(0, 2) * 24 * 60 * 60;
    const resultWallet = await dbOpration.readTablesData(
      localDB.tableName.tblWallet
    );
    let mnemonic = resultWallet.temp[0].mnemonic.replace(/,/g, " ");
    const dateTime = Date.now();
    const fulldate = Math.floor(dateTime / 1000);
    const blocks = parseInt(data.sec / (3600 * 10));
    const res = await vaultAccount.createTLC(mnemonic, null, blocks);
    let data1 = {};
    data1.sec = item.days.slice(0, 2) * 24 * 60 * 60;
    data1.validDate = unitDate;
    data1.lockTime = res.lockTime;
    data1.privateKey = res.privateKey;
    this.connection_VaultAccount(fulldate, res.address, data1);
  }

  async connection_VaultAccount(fulldate, address, data) {
    const resultCreateAccount = await dbOpration.insertLastBeforeCreateAccount(
      localDB.tableName.tblAccount,
      fulldate,
      address,
      "BTC",
      "Vault",
      data
    );
    if (resultCreateAccount) {
      this.setState({
        isLoading: false,
        alertPopupData: [
          {
            theme: "success",
            status: true,
            icon: "smile",
            title: "Success",
            subtitle: "Vault account Created.",
            goBackStatus: true
          }
        ]
      });
    }
  }

  //TODO: changeDate
  async changeDate(date: any) {
    let hexDate = utils.getUnixTimeDate(date);
    const resultWallet = await dbOpration.readTablesData(
      localDB.tableName.tblWallet
    );
    let mnemonic = resultWallet.temp[0].mnemonic.replace(/,/g, " ");
    const dateTime = Date.now();
    const fulldate = Math.floor(dateTime / 1000);
    const blocks = -30000; //parseInt(data.sec / (3600 * 10));
    const res = await vaultAccount.createTLC(mnemonic, null, blocks);
    let data1 = {};
    data1.sec = -30000; //item.days.slice(0, 2) * 24 * 60 * 60;
    data1.validDate = hexDate; //unitDate;
    data1.lockTime = res.lockTime;
    data1.privateKey = res.privateKey;
    this.connection_VaultAccount(fulldate, res.address, data1);
  }

  render() {
    const textStyle = {
      textAlign: "center",
      color: "#696969",
      fontWeight: "bold"
    };

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

            <DatePicker
              style={{ width: "96%" }}
              date={this.state.date}
              mode="date"
              max
              placeholder="select date"
              format="DD-MM-YYYY"
              maxDate={new Date()}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: "absolute",
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 36
                }
                // ... You can check the source to find the other keys.
              }}
              onDateChange={(date: any) => {
                this.changeDate(date);
              }}
            />
            <View style={styles.viewSelectPeriod}>
              <Text style={{ textAlign: "center" }}>OR</Text>
              <ReactNativeItemSelect
                data={this.state.data}
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
                  btnTxt: { fontSize: 18 },
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
              <Text style={{ color: "red", textAlign: "center" }}>
                Note: If before date add to select datepicker
              </Text>
            </View>
          </ImageBackground>
        </Content>
        {renderIf(this.state.isLoading)(
          <View style={styles.loading}>
            <SkypeIndicator color={colors.appColor} />
          </View>
        )}
        <DropdownAlert ref={ref => (this.dropdown = ref)} />
        <SCLAlertOk
          data={this.state.alertPopupData}
          click_Ok={(status: boolean) => {
            status
              ? this.props.navigation.navigate("TabbarBottom")
              : console.log(status),
              this.setState({
                alertPopupData: [
                  {
                    status: false
                  }
                ]
              });
          }}
        />
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
    flex: 2,
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
  }
});
