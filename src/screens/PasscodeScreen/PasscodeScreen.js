import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  AsyncStorage,
  StatusBar,
  Vibration,
  KeyboardAvoidingView,
  Dimensions
} from "react-native";
import { StackActions, NavigationActions } from "react-navigation";
import Spinner from "react-native-loading-spinner-overlay";
import CodeInput from "react-native-confirmation-code-input";
import DropdownAlert from "react-native-dropdownalert";


//TODO: Custome Pages
import { colors, images, localDB } from "../../constants/Constants";
import SQLite from "react-native-sqlite-storage";
var db = SQLite.openDatabase(localDB.dbName, "1.0", "MyMoney Database", 200000);

//TODO: Wallets
//var createWallet = require('../../bitcoin/services/wallet');
import WalletService from "../../bitcoin/services/WalletService";

const { height, width } = Dimensions.get("window");
export default class PasscodeScreen extends Component {
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
      message: "Enter your PIN"
    };
  }

  //TODO: Page Life Cycle
  componentWillMount() {
    this.retrieveData();
  }

  retrieveData = async () => {
    try {
      var passcodeValues = await AsyncStorage.getItem("@Passcode:key");

      this.setState({
        pincode: passcodeValues
      });
    } catch (error) {
      console.log(error);
    }
    console.log("pincode = " + this.state.pincode);
  };

  _onFinishCheckingCode2(isValid, code) {
    if (isValid) {
      this.onSuccess();
    } else {
      this.dropdown.alertWithType(
        "error",
        "Error",
        "Oh!! Please enter correct password"
      );
    }
  }

  onSuccess = () => {
    const resetAction = StackActions.reset({
      index: 0, // <-- currect active route from actions array
      key: null,
      actions: [NavigationActions.navigate({ routeName: "TabbarBottom" })]
    });
    this.props.navigation.dispatch(resetAction);
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={[styles.txtText,styles.txtTitle]}>My Money</Text>
        <Text style={[styles.txtText]}>{this.state.message}</Text>
        <CodeInput
          ref="codeInputRef2"
          secureTextEntry
          keyboardType="numeric"
          codeLength={4}
          activeColor={colors.appColor}
          inactiveColor={colors.appColor}
          className="border-circle"
          compareWithCode={this.state.pincode}
          cellBorderWidth={2}
          autoFocus={true}
          inputPosition="center"
          space={10}
          size={50}
          containerStyle={{ marginTop: Dimensions.get("screen").height / 3 }}
          codeInputStyle={{ borderWidth: 1.5 }}
          codeInputStyle={{ fontWeight: "800" }}
          containerStyle={styles.codeInput}
          onFulfill={(isValid, code) =>
            this._onFinishCheckingCode2(isValid, code)
          }   
        />
        <DropdownAlert ref={ref => (this.dropdown = ref)} />
      </View>
    );
  }  
}  

let styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  txtText:{
    color:colors.appColor,
    fontFamily: "Lalezar"
  },
 txtTitle: {
     marginTop: 100,
     fontSize: 40,
  }  
});
