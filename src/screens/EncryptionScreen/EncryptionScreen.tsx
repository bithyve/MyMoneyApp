import React, { Component } from "react";
import { View, AsyncStorage } from "react-native";
import Loader from "react-native-modal-loader";
import { colors } from "../../app/constants/Constants";

interface Props {
  onComplited: Function;
}

export default class EncryptionScreen extends Component<Props, any> {
  constructor(props: any) {
    super(props);
  }

  async componentDidMount() {
    var status = await AsyncStorage.getItem("PasscodeCreateStatus");
    setTimeout(() => {
      if (status) {
        this.props.onComplited(false);
      } else {
        this.props.onComplited(true);
      }
    }, 500);
  }

  render() {
    return (
      <View>
        <Loader loading={true} color={colors.appColor} />
      </View>
    );
  }
}
