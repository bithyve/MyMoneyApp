import React, { Component } from "react";
import { StyleSheet, View, AsyncStorage } from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Left,
  Right,
  Body,   
  Text
} from "native-base";
//Custome Compontes
import ViewOnBoarding from "../../../app/custcompontes/view/ViewOnBoarding";
import Icon from "react-native-vector-icons/FontAwesome5";
//TODO: Custome object
import { images } from "../../../app/constants/Constants";
export default class AccountDetailsOnboardingScreen extends Component<
  any,
  any
> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: [],
      type: null
    };
  }

  //TODO: Page Life Cycle

  componentWillMount() {
    const { navigation } = this.props;
    const type = navigation.getParam("type");

    if (type == "Secure") {
      this.setState({
        data: [
          {
            backgroundColor: "#FFD900",
            image: images.accountDetailsOnBoarding.secureAccount.img1,
            title: "The Future of Money",
            subtitle:
              "We are passionate about open blockchains and the potential it offers for the world of finance. Contact us to know more. "
          },
          {
            backgroundColor: "#FFD900",
            image: images.accountDetailsOnBoarding.secureAccount.img2,
            title: "How You’re Protected",
            subtitle:
              "While money needs to be smart, more importantly it needs to be secure. We are very keen to use the best industry standards in software delivery and cryptography to ensure this."
          },
          {
            backgroundColor: "#FFD900",
            image: images.accountDetailsOnBoarding.secureAccount.img3,
            title: "Why Us?",
            subtitle:
              "If you are interested in open blockchains which are permission less and smart contracts built on them then this is where you belong. Please contact us for further details."
          }
        ],
        type: type
      });
    } else {
      this.setState({
        data: [
          {
            backgroundColor: "#FFD900",
            image: images.accountDetailsOnBoarding.vaultAccount.img1,
            title: "The Future of Money",
            subtitle:
              "We are passionate about open blockchains and the potential it offers for the world of finance. Contact us to know more. "
          },
          {
            backgroundColor: "#FFD900",
            image: images.accountDetailsOnBoarding.vaultAccount.img2,
            title: "How You’re Protected",
            subtitle:
              "While money needs to be smart, more importantly it needs to be secure. We are very keen to use the best industry standards in software delivery and cryptography to ensure this."
          },
          {
            backgroundColor: "#FFD900",
            image: images.accountDetailsOnBoarding.vaultAccount.img3,
            title: "Why Us?",
            subtitle:
              "If you are interested in open blockchains which are permission less and smart contracts built on them then this is where you belong. Please contact us for further details."
          }
        ],
        type: type
      });
    }
  }

  async componentDidMount() {
    try {
      AsyncStorage.setItem("flag_BackgoundApp", JSON.stringify(true));
    } catch (error) {  
      console.log(error);
    }
  }

  //TODO: func click_Done

  click_Done() {
    if (this.state.type == "Secure") {
      this.props.navigation.push("SecureAccountScreen");
      //this.props.navigation.push("ValidateSecureAccountScreen");
    } else if (this.state.type == "Joint") {
      this.props.navigation.push("CreateJointAccountScreen");
    } else {
      this.props.navigation.push("ValidateSecureAccountScreen");
    }
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.container} scrollEnabled={false}>
          <Header
            transparent
            style={{ backgroundColor: "#FFD900", position: "relative" }}
          >
            <Left>
              <Button transparent onPress={() => this.props.navigation.pop()}>
                <Icon name="chevron-left" size={25} color="#ffffff" />
              </Button>
            </Left>
            <Body style={{ flex: 0, alignItems: "center" }}>
              <Title />
            </Body>
            <Right />
          </Header>

          <ViewOnBoarding
            data={this.state.data}
            click_Done={() => this.click_Done()}
          />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
