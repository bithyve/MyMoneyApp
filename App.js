/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { createRootNavigator } from "./src/navigation/Router";   
import { createAppContainer } from "react-navigation";  

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {  
      signedIn: false
    };
    console.disableYellowBox = true;
  }
  render() {
    const { signedIn } = this.state;
    const Layout = createRootNavigator(signedIn);     
    const AppContainer = createAppContainer(Layout);
    //return <Layout />;
    return <AppContainer />;   
  }
}
