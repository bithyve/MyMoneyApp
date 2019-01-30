/** @format */
import React from "react";
import { AppRegistry } from "react-native";
import { createAppContainer } from "react-navigation";
import { AsyncStorage, AppState } from "react-native";
import App from "./App";
import "./shim";
import { name as appName } from "./app.json";
import { createRootNavigator } from "./src/app/router/router";
// import EncryptionScreen from "../"
import EncryptionScreen from "./src/screens/EncryptionScreen/EncryptionScreen";

class MyMoney extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: true,
      isStartPage: "OnBoardingNavigator",
      appState: AppState.currentState
    };
  }

  async componentDidMount() {
    try {
      AppState.addEventListener("change", this._handleAppStateChange);
      AsyncStorage.setItem("flag_BackgoundApp", JSON.stringify(true));
    } catch (error) {
      // Error saving data
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = async nextAppState => {
    var status = JSON.parse(await AsyncStorage.getItem("PasscodeCreateStatus"));
    let flag_BackgoundApp = JSON.parse(
      await AsyncStorage.getItem("flag_BackgoundApp")
    );
    if (status && flag_BackgoundApp) {
      this.setState({ appState: AppState.currentState });
      if (this.state.appState.match(/inactive|background/)) {
        console.log({ status });
        this.setState({
          status: true
        });
        console.log("forgound = " + this.state.status, this.state.isStartPage);
      }
    }
  };

  onComplited(status, pageName) {
    this.setState({
      status: status,
      isStartPage: pageName
    });
  }
  render() {
    const Layout = createRootNavigator(
      this.state.status,
      this.state.isStartPage
    );
    console.log("first = " + this.state.status, this.state.isStartPage);
    const AppContainer = createAppContainer(Layout);
    return this.state.status ? (
      <EncryptionScreen
        onComplited={(status: boolean, pageName: string) =>
          this.onComplited(status, pageName)
        }
      />
    ) : (
      <AppContainer />
    );
  }
}

console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => MyMoney);
