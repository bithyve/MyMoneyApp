import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  AsyncStorage,
  StatusBar,
  Vibration,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { StackActions, NavigationActions } from "react-navigation";
import Spinner from "react-native-loading-spinner-overlay";
import CodeInput from "react-native-confirmation-code-input";
import BusyIndicator from "react-native-busy-indicator";
import loaderHandler from "react-native-busy-indicator/LoaderHandler";
import DropdownAlert from "react-native-dropdownalert";
import renderIf from "../../constants/validation/renderIf";
import CardFlip from "react-native-card-flip";
//TODO: Custome Pages
import { colors, images, localDB } from "../../constants/Constants";
var dbOpration = require("../../manager/database/DBOpration");

//TODO: Wallets
import WalletService from "../../bitcoin/services/WalletService";

const { height, width } = Dimensions.get("window");

export default class PasscodeConfirmScreen extends Component {
  constructor() {
    super();
    this.state = {
      mnemonicValues: [],
      status: "choice",
      pincode: "",
      success: "Enter a PinCode!!",
      firstName: "",
      lastName: "",
      email: "",
      mobileNo: "",
      countryName: ""
    };
  }

  //TODO: Page Life Cycle
  componentWillMount() {
    const { navigation } = this.props;
    this.setState({
      firstName: navigation.getParam("firstName"),
      lastName: navigation.getParam("lastName"),
      email: navigation.getParam("email"),
      mobileNo: navigation.getParam("mobileNo"),
      countryName: navigation.getParam("countryName")
    });
  }
  componentWillUnmount() {
    loaderHandler.hideLoader();
  }

  onCheckPincode(code) {
    this.setState({
      status: "confirm",
      pincode: code,
      success: "Confirm your PinCode!!"
    });
    this.card.flip();
  }

  _onFinishCheckingCode2(isValid, code) {
    loaderHandler.showLoader("Loading");
    if (isValid) {
      this.saveData();
    } else {
      loaderHandler.hideLoader();
      this.dropdown.alertWithType(
        "error",
        "Error",
        "Oh!! Please enter correct password"
      );
    }
  }

  saveData = async () => {
    const {
      mnemonic,
      address,
      privateKey
    } = await WalletService.createWallet();
    console.log(mnemonic);
    this.setState({
      mnemonicValues: mnemonic.split(" ")
    });
    if (this.state.mnemonicValues.length > 0) {
      //mnemonic key
      var mnemonicValue = this.state.mnemonicValues;
      var priKeyValue = privateKey;
      //User Details Data
      const dateTime = Date.now();
      const fulldate = Math.floor(dateTime / 1000);
      const firstName = this.state.firstName;
      const lastName = this.state.lastName;
      const email = this.state.email;
      const country = this.state.countryName;
      const mobileNumber = this.state.mobileNo;
      const resultInsertUserDetails = await dbOpration.insertUserDetailsData(
        localDB.tableName.tblUser,
        fulldate,
        firstName,
        lastName,
        email,
        country,
        mobileNumber
      );
      if (resultInsertUserDetails) {
        const resultCreateWallet = await dbOpration.insertWalletAndCreateAccountType(
          localDB.tableName.tblWallet,
          localDB.tableName.tblAccount,
          fulldate,
          mnemonicValue,
          priKeyValue,
          address
        );
        if (resultCreateWallet) {
          this.setState({
            success: "Ok!!"
          });
          const resetAction = StackActions.reset({
            index: 0, // <-- currect active route from actions array
            key: null,
            actions: [NavigationActions.navigate({ routeName: "TabbarBottom" })]
          });
          this.props.navigation.dispatch(resetAction);
          try {
            AsyncStorage.setItem("@Passcode:key", this.state.pincode);
            AsyncStorage.setItem("@loadingPage:key", "Password");
          } catch (error) {
            // Error saving data
          }
        }
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={[styles.txtText, styles.txtTitle]}>My Money</Text>
        <Text style={[styles.txtText]}>{this.state.success}</Text>
        <CardFlip style={styles.cardContainer} ref={card => (this.card = card)}>
          {renderIf(this.state.status == "choice")(
            <CodeInput
              ref="codeInputRef2"
              secureTextEntry
              keyboardType="numeric"
              codeLength={4}
              activeColor={colors.appColor}
              inactiveColor={colors.appColor}
              className="border-circle"
              cellBorderWidth={2}
              autoFocus={true}
              inputPosition="center"
              inputPosition="center"
              space={10}
              size={50}
              codeInputStyle={{ borderWidth: 1.5 }}
              codeInputStyle={{ fontWeight: "800" }}
              onFulfill={code => this.onCheckPincode(code)}
            />
          )}
          {renderIf(this.state.status == "confirm")(
            <CodeInput
              ref="codeInputRef2"
              secureTextEntry
              keyboardType="numeric"
              codeLength={4}
              activeColor={colors.appColor}
              inactiveColor={colors.appColor}
              className="border-circle"
              cellBorderWidth={2}
              compareWithCode={this.state.pincode}
              autoFocus={true}
              inputPosition="center"
              inputPosition="center"  
              space={10}
              size={50}
              codeInputStyle={{ borderWidth: 1.5 }}
              codeInputStyle={{ fontWeight: "800" }}
              onFulfill={(isValid, code) =>
                this._onFinishCheckingCode2(isValid, code)
              }
            />
          )}
        </CardFlip>
        <BusyIndicator />
        <DropdownAlert ref={ref => (this.dropdown = ref)} />
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  txtText: {
    color: colors.appColor,
    fontFamily: "Lalezar"
  },
  txtTitle: {
    marginTop: 100,
    fontSize: 40
  }
});
