import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  ImageBackground,
  Dimensions,
  Switch
} from "react-native";
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
import Icon from "react-native-vector-icons/FontAwesome";
import { SkypeIndicator } from "react-native-indicators";
import DropdownAlert from "react-native-dropdownalert";

//TODO: Custome class
import renderIf from "../../../constants/validation/renderIf";
import { colors, images, apiary } from "../../../constants/Constants";
var utils = require("../../../constants/Utils");
const { width, height } = Dimensions.get("screen");

export default class SecureAccountScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }

  //TODO: func click_CreateSecureAccount
  async click_CreateSecureAccount() {
    this.stopLoading(true);
    try {
      fetch(apiary.setup2fa, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(responseJson => {
          this.props.navigation.push("SecureSecretKeyScreen", {
            data: responseJson
          });
          this.stopLoading(false);
        })
        .catch(error => {
          this.dropdown.alertWithType("error", "OH!!", error);
          this.stopLoading(false);
        });
    } catch (error) {
      this.dropdown.alertWithType("error", "OH!!", error);
      this.stopLoading(false);
    }
  }

  //TODO: func stopLoading

  stopLoading(value) {
    this.setState({
      isLoading: value
    });
  }

  render() {
    const { activeSections } = this.state;
    return (
      <Container>
        <Content contentContainerStyle={styles.container} scrollEnabled={false}>
          <ImageBackground
            source={images.appBackgound}
            style={styles.backgroundImage}
          >
            <Header transparent>
              <Left>
                <Button transparent onPress={() => this.props.navigation.pop()}>
                  <Icon name="chevron-left" size={25} color="#ffffff" />
                </Button>
              </Left>
              <Body>
                <Title />
              </Body>
              <Right />
            </Header>

            <View style={styles.logoSecureAccount}>
              <Image
                style={styles.secureLogo}
                source={images.secureAccount.secureLogo}
              />
              <Text style={styles.txtTitle}>Secure Account</Text>
              <Text style={styles.txtNote}>
                First of all, you need to realize that there’s a huge difference
                between a blockchain and cryptocurrencies. Blockchain is a
                technology which is used to create crypto money like bitcoin or
                ethereum.
              </Text>
            </View>
            <View style={styles.createAccountBtn}>
              <Button
                transparent
                style={{
                  backgroundColor: colors.appColor,
                  flexDirection: "row",
                  paddingLeft: 20,
                  paddingRight: 10,
                  borderRadius: 5
                }}
                onPress={() => this.click_CreateSecureAccount()}
              >
                <Text style={styles.txtBtnTitle}>Create Account</Text>
                <Icon name="chevron-right" size={25} color="#ffffff" />
              </Button>
            </View>
          </ImageBackground>
        </Content>
        {renderIf(this.state.isLoading)(
          <View style={styles.loading}>
            <SkypeIndicator color={colors.appColor} />
          </View>
        )}
        <DropdownAlert ref={ref => (this.dropdown = ref)} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  backgroundImage: {
    flex: 1
  },
  logoSecureAccount: {
    flex: 4,
    alignItems: "center"
  },
  secureLogo: {
    height: 120,
    width: 120
  },
  txtTitle: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 28
  },
  txtNote: {
    padding: 10,
    fontSize: 18,
    marginTop: 20
  },
  //view:createAccountBtn
  createAccountBtn: {
    flex: 2,
    marginTop: 20,
    alignSelf: "center"
  },
  txtBtnTitle: {
    color: colors.white
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.8,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center"
  }
});
