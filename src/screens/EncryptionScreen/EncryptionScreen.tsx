import React, { Component } from "react";
import { View, AsyncStorage, Image, StyleSheet, Text } from "react-native";
import Loader from "react-native-modal-loader";
import { colors } from "../../app/constants/Constants";
import Singleton from "../../app/constants/Singleton";

interface Props {
  onComplited: Function;
}

export default class EncryptionScreen extends Component<Props, any> {
  constructor(props: any) {
    super(props);
  }

  async componentDidMount() {
    let commonData = Singleton.getInstance();
    var status = await AsyncStorage.getItem("PasscodeCreateStatus");
    var passcode = await AsyncStorage.getItem("@Passcode:key");
    commonData.setPasscode(passcode);
    setTimeout(() => {
      if (status) {
        this.props.onComplited(false);
      } else {
        this.props.onComplited(true);
      }
    }, 1000);
  }  

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.appLogo}
          source={require("../../assets/images/appLogo.png")}
        />
        <Text style={styles.txtAppName}>MY MONEY</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  appLogo: {
    width: 300,
    height: 300,
    borderRadius: 150
  },
  txtAppName: {
    fontSize: 40,
    fontWeight: "bold",
    marginTop: 20,
    color: colors.appColor
  }
});
