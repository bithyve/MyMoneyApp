import React from "react";
import { StyleSheet, View } from "react-native";
import { StackActions, NavigationActions } from "react-navigation";
import CreateTables from "../../../app/manager/database/CreateTables";  
//Custome Compontes
import ViewOnBoarding from "../../../app/custcompontes/view/ViewOnBoarding";
//Json Files
import onBoardingData from "../../../assets/jsonfiles/onBoardingScreen/onBoardingScreen.json";
   
//TODO: Custome object
import { images } from "../../../app/constants/Constants";

export default class OnBoardingScreen extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentWillMount() {
    this.setState({
      data: onBoardingData.onBoarding
    });
  }

  //TODO: func click_Done
  click_Done() {
    console.log("click");
    const resetAction = StackActions.reset({
      index: 0, // <-- currect active route from actions array
      key: null,
      actions: [
        NavigationActions.navigate({ routeName: "PasscodeConfirmScreen" })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    const data = [
      {
        backgroundColor: "#FFD900",
        image: images.onBoardingScreen.onB1,
        title: "The Future of Money",
        subtitle:
          "We are passionate about open blockchains and the potential it offers for the world of finance. Contact us to know more. "
      },
      {
        backgroundColor: "#FFD900",
        image: images.onBoardingScreen.onB2,
        title: "How You’re Protected",
        subtitle:
          "While money needs to be smart, more importantly it needs to be secure. We are very keen to use the best industry standards in software delivery and cryptography to ensure this."
      },
      {
        backgroundColor: "#FFD900",
        image: images.onBoardingScreen.onB3,
        title: "Why Us?",
        subtitle:
          "If you are interested in open blockchains which are permission less and smart contracts built on them then this is where you belong. Please contact us for further details."
      }
    ];
    return (
      <View style={styles.container}>
        <ViewOnBoarding data={data} click_Done={() => this.click_Done()} />
        <CreateTables />
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
