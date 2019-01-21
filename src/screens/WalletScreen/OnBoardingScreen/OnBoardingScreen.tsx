import React from "react";
import {
  StyleSheet,
  View,
  Image,
  StatusBar,
  Dimensions,
  AsyncStorage,
  Text,
  TextInput
} from "react-native";
import { Container, Body, Footer } from "native-base";
import Onboarding from "react-native-onboarding-swiper";

export default class OnBoardingScreen extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      imageName: null
    };
  }

  //TODO: func click_Done
  click_Done() {}

  render() {
    return (
      <View style={styles.container}>
        <Onboarding
          onDone={() => this.click_Done()}
          onSkip={() => this.click_Done()}
          pages={[
            {  
              backgroundColor: "#7AE58F",
              image: (
                <Image
                  style={{ width: 200, height: 200, borderRadius: 100 }}
                  resizeMode="cover"
                  source={require("../../../assets/images/onBoardingScreen/bitcoin.png")}
                />
              ),  
              title: "My  Money",
              subtitle: "Mobile App"
            },
            {
              backgroundColor: "#006505",
              image: (
                <Image
                  style={{ width: 200, height: 200, borderRadius: 100 }}
                  resizeMode="cover"   
                  source={require("../../../assets/images/onBoardingScreen/bitcoin.png")}
                />
              ),
              title: "BitHyve",
              subtitle: "US"
            }
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  }
});
