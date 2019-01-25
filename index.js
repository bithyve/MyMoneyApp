/** @format */
import React from "react";
import { AppRegistry } from "react-native";
import { createAppContainer } from "react-navigation";
import { AsyncStorage } from "react-native";

import App from "./App";
import "./shim";
import { name as appName } from "./app.json";
import { createRootNavigator } from "./src/app/router/router";
// import EncryptionScreen from "../"
import EncryptionScreen from "./src/screens/EncryptionScreen/EncryptionScreen";

class MyMoney extends React.Component {
  constructor(props) {
    super(props);
    this.state = { status: true, isStartPage: "OnBoardingNavigator" };
  }   

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
    const AppContainer = createAppContainer(Layout);
    return this.state.status ? (
      this.state.isStartPage == "OnBoardingNavigator" ? (
        <EncryptionScreen
          onComplited={(status: boolean, pageName: string) =>
            this.onComplited(status, pageName)
          }
        />
      ) : (
        <AppContainer />
      )
    ) : (
      <AppContainer />
    );
  }
}

console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => MyMoney);
