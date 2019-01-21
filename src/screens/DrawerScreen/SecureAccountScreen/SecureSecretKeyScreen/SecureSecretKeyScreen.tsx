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
  Clipboard
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
  localDB,
  msg
} from "../../../../app/constants/Constants";
var dbOpration = require("../../../../app/manager/database/DBOpration");
var utils = require("../../../../app/constants/Utils");
import renderIf from "../../../../app/constants/validation/renderIf";
   
export default class SecureSecretKeyScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qrData: "",
      secretKey: "",
      bhAddress: "",
      data: []
    };
  }

  componentWillMount() {
    const { navigation } = this.props;
    let data = navigation.getParam("data");
    console.log(JSON.stringify(data));
    this.setState({
      data: data,
      qrData: data.qrData,
      secretKey: data.secret,
      bhAddress: data.bhAddress
    });
  }

  //TODO: Func
  click_CopySecretKey() {
    Clipboard.setString(this.state.state);
    Toast.show("Secret key copyed.!", Toast.SHORT);
  }

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
              <Text style={[styles.txtSecretKeyTitle]}>Secret Key</Text>
              <TouchableOpacity onPress={() => this.click_CopySecretKey()}>
                <Text>{this.state.secretKey}</Text>
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
                    data: this.state.data
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
