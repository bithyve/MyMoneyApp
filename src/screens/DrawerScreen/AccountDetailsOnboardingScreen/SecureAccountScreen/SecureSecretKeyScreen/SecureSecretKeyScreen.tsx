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
  Clipboard,
  AsyncStorage
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
import { QRCode } from "react-native-custom-qr-codes";
import Toast from "react-native-simple-toast";

//TODO: Custome Pages
import {
  colors,
  images,
  msg,
  apiary
} from "../../../../../app/constants/Constants";

export default class SecureSecretKeyScreen extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      qrData: "",
      secret: "",
      bhXpub: "",
      data: [],
      mnemonic: null
    };
  }

  componentWillMount() {
    const { navigation } = this.props;
    let data = navigation.getParam("data");

    this.setState({
      data: data,
      mnemonic: navigation.getParam("mnemonic"),
      qrData: data.setupData.qrData,
      secret: data.setupData.secret,
      bhXpub: data.setupData.bhXpub
    });
  }

  componentDidMount() {
    this.setAppState(true);
  }

  async setAppState(status: boolean) {
    if (status) {   
      try {   
        AsyncStorage.setItem("flag_BackgoundApp", JSON.stringify(true));
      } catch (error) {
        // Error saving data
      }  
    } else {
      try {
        AsyncStorage.setItem("flag_BackgoundApp", JSON.stringify(false));
      } catch (error) {
        // Error saving data
      }
    }
  }

  componentWillUnmount() {
    this.setAppState(false);
  }

  //TODO: Func
  click_CopySecretKey = async () => {
    await Clipboard.setString(this.state.secret);
    Toast.show("Secret key copyed.!", Toast.SHORT);
  };   

  render() {
    const { activeSections } = this.state;
    return (
      <Container>
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
            <Body style={{ flex: 0, alignItems: "center" }}>
              <Title
                adjustsFontSizeToFit={true}
                numberOfLines={1}
                style={styles.titleUserName}
              />
            </Body>
            <Right />
          </Header>
          <Content
            contentContainerStyle={styles.container}
            scrollEnabled={false}
            padder
          >
            <View style={styles.viewSecretKey}>
              <QRCode
                logo={images.appIcon}
                logoSize={60}
                content={this.state.qrData}
                size={Dimensions.get("screen").width / 2}
                codeStyle="square"
                outerEyeStyle="square"
                innerEyeStyle="square"
                padding={1}
              />
              <Text style={[styles.txtSecretKeyTitle]}>Secret</Text>
              <TouchableOpacity onPress={() => this.click_CopySecretKey()}>
                <Text>{this.state.secret}</Text>
              </TouchableOpacity>
              <Text style={styles.txtStaticMsg} note>
                {msg.secretKeyMsg}
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
                onPress={() =>
                  this.props.navigation.push("ValidateSecureAccountScreen", {
                    data: this.state.data,
                    mnemonic: this.state.mnemonic
                  })
                }
              >
                <Text style={[styles.txtBtnTitle, styles.txtWhite]}>Next</Text>
                <Icon name="chevron-right" size={25} color="#ffffff" />
              </Button>
            </View>
          </Content>
        </ImageBackground>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  backgroundImage: {
    flex: 1
  },
  txtWhite: {
    color: "#fff"
  },
  viewSecretKey: {
    flex: 2,
    alignItems: "center"
  },
  txtSecretKeyTitle: {
    paddingTop: 15,
    marginBottom: 10,
    fontSize: 22,
    textDecorationLine: "underline"
  },
  txtStaticMsg: {
    paddingTop: 10,
    textAlign: "center"
  },
  //createAccountBtn
  createAccountBtn: {
    flex: 1
  }
});
