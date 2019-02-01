import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ImageBackground,
  Clipboard,
  Dimensions
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
import Share from "react-native-share";
//TODO: Custome Pages
import { colors, images } from "../../../../app/constants/Constants";

export default class ReceiveMoneyScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: ""
    };
  }

  componentWillMount() {
    const { navigation } = this.props;
    this.setState({
      address: navigation.getParam("address")
    });
  }

  //TODO: Func Copy they code
  click_CopyAddress = async () => {
    await Clipboard.setString(this.state.address);
    Toast.show("Address copyed.!", Toast.SHORT);
  };

  render() {
    let shareOptions = {
      title: "Address",
      message: this.state.address,
      url: "\nhttps://bithyve.com/",
      subject: "MyMoney" //  for email
    };
    return (
      <Container>
        <ImageBackground
          source={images.appBackgound}
          style={styles.backgroundImage}
        >
          <Header transparent>
            <Left>
              <Button
                transparent
                onPress={() => this.props.navigation.goBack()}
              >
                <Icon name="chevron-left" size={25} color="#ffffff" />
              </Button>
            </Left>
            <Body style={{ flex: 0, alignItems: "center" }}>
              <Title
                adjustsFontSizeToFit={true}
                numberOfLines={1}
                style={styles.titleUserName}
              >
                Receive
              </Title>
            </Body>
            <Right />
          </Header>
          <Content
            contentContainerStyle={styles.container}
            scrollEnabled={false}
          >
            <View style={styles.viewShowQRcode}>
              <QRCode
                logo={images.appIcon}
                content={this.state.address}
                size={Dimensions.get("screen").width - 40}
                codeStyle="square"
                outerEyeStyle="square"
                innerEyeStyle="square"
                //linearGradient={['rgb(255,0,0)','rgb(0,255,255)']}
                padding={1}
              />
              <TouchableOpacity onPress={() => this.click_CopyAddress()}>
                <Text style={styles.txtBarcode} note>
                  {this.state.address}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.viewShareButtonMain}>
              <View style={styles.viewSahreBtn}>
                <Button
                  transparent
                  onPress={() => {
                    Share.open(shareOptions);
                  }}
                >
                  <Icon name="share-square" size={25} color="#ffffff" />
                  <Text style={styles.titleUserName}>Share</Text>
                </Button>
              </View>
            </View>
          </Content>
        </ImageBackground>
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
  titleUserName: {
    color: "#ffffff"
  },
  viewShowQRcode: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  txtTitle: {
    marginBottom: 20,
    fontSize: 18,
    fontWeight: "bold"
  },
  txtBarcode: {
    marginTop: 40,
    marginBottom: 20,
    fontSize: 16,
    textAlign: "center"
  },
  btnCopy: {
    backgroundColor: colors.appColor
  },
  //share button
  viewShareButtonMain: {
    flex: 0.2,
    alignItems: "center",
    justifyContent: "center"
  },
  viewSahreBtn: {
    backgroundColor: colors.appColor,
    paddingLeft: 10,
    borderRadius: 10
  }   
});
