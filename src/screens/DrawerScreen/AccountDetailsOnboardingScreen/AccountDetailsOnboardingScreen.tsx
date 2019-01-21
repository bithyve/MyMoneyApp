import React, { Component } from "react";
import { Alert, Image, View } from "react-native";
import Onboarding from "react-native-onboarding-swiper";

export default class AccountDetailsOnboardingScreen extends Component<
  any,
  any
> {
  constructor(props) {
    super(props);
  }
  
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
