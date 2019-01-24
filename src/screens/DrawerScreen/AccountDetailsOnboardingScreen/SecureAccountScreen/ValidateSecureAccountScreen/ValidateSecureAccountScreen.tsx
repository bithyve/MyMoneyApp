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
  Text,
  Input
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { SkypeIndicator } from "react-native-indicators";
import Toast from "react-native-simple-toast";

//TODO: Custome Pages
import {
  colors,
  images,
  localDB,
  apiary
} from "../../../../../app/constants/Constants";
var dbOpration = require("../../../../../app/manager/database/DBOpration");
import renderIf from "../../../../../app/constants/validation/renderIf";

const { width, height } = Dimensions.get("screen");

//Custome Compontes
import SCLAlertOk from "../../../../../app/custcompontes/alert/SCLAlertOk";

//TODO: Wallets
import WalletService from "../../../../../bitcoin/services/WalletService";

export default class ValidateSecureAccountScreen extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      tokenKey: "",
      validBtnBgColor: "gray",
      validBtnStaus: true,
      data: [],
      alertPopupData: [],
      isLoading: false
    };
  }

  //TODO: Page Life Cycle
  componentWillMount() {
    const { navigation } = this.props;
    let data = navigation.getParam("data");
    this.setState({
      data: data
    });
  }

  //TODO: func validation
  validation(val: any) {
    if (val.length == 6) {
      this.setState({
        tokenKey: val,
        validBtnBgColor: colors.appColor,
        validBtnStaus: false
      });
    } else {
      this.setState({
        tokenKey: val,
        validBtnBgColor: "gray",
        validBtnStaus: true
      });
    }
  }

  //TODO: func click_Validation
  async click_Validation() {
    let mnemonicValues;
    this.setState({
      isLoading: true
    });
    try {
      // Generating the secondary mnemonic
      const primaryWalletAddress = await dbOpration.readWalletAddress(
        localDB.tableName.tblWallet,
        "Primary"
      );
      console.log("saving data =" + JSON.stringify(primaryWalletAddress));
      if (primaryWalletAddress.temp[0].privateKey) {
        //new Wallet create
        const {
          mnemonic,
          address,
          privateKey
        } = await WalletService.createWallet();
        mnemonicValues = mnemonic.split(" ");
        if (mnemonicValues.length > 0) {
          const dateTime = Date.now();
          const fulldate = Math.floor(dateTime / 1000);
          const resultRecoveryWallet = await dbOpration.insertWallet(
            localDB.tableName.tblWallet,
            fulldate,
            mnemonicValues,
            privateKey,
            address,
            "RecoveryWallet"
          );
          if (resultRecoveryWallet) {
            const recoveryWalletAddress = await dbOpration.readWalletAddress(
              localDB.tableName.tblWallet,
              "RecoveryWallet"
            );  
            if (recoveryWalletAddress.temp[0].address) {
              let primaryPubKey = await WalletService.getPubKey(
                primaryWalletAddress.temp[0].privateKey
              );
              let recoveryPubKey = await WalletService.getPubKey(
                recoveryWalletAddress.temp[0].privateKey
              );
              let bhPubKey = Buffer.from(
                JSON.parse(this.state.data.bhPubKey).data
              );

              const multiSigAddress = await WalletService.createMultiSig(2, [
                primaryPubKey,
                recoveryPubKey,
                bhPubKey
              ]);
              fetch(apiary.validate2fasetup, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  token: this.state.tokenKey,
                  secret: this.state.data.secret,
                  multiSigAddress: multiSigAddress.address
                })
              })
                .then(response => response.json())
                .then(responseJson => {
                  if (responseJson.setupSuccessful) {
                    this.connection_SaveSecureAccount(
                      fulldate,
                      multiSigAddress.address,
                      this.state.data.bhPubKey
                    );
                  } else {
                    this.setState({
                      alertPopupData: [
                        {
                          theme: "danger",
                          status: true,
                          icon: "frown",
                          title: "Oops!!",
                          subtitle:
                            "Invalid token number.Please enter correct token number.!!",
                          goBackStatus: false
                        }
                      ]
                    });
                  }
                  this.setState({
                    isLoading: false
                  });
                })
                .catch(error => {
                  Toast.show(error, Toast.SHORT);
                });
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async connection_SaveSecureAccount(fulldate, address, bhPubKey) {
    const resultCreateAccount = await dbOpration.insertLastBeforeCreateAccount(
      localDB.tableName.tblAccount,
      fulldate,
      address,
      "BTC",
      "Secure",
      bhPubKey
    );
    if (resultCreateAccount) {
      this.setState({
        alertPopupData: [
          {
            theme: "success",
            status: true,
            icon: "smile",
            title: "Success!!",
            subtitle: "Secure account Created.",
            goBackStatus: true
          }
        ]
      });
    }
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
            <View style={styles.logoSecureAccount}>
              <Image
                style={styles.secureLogo}
                source={images.secureAccount.validationKey}
              />
              <Text style={styles.txtTitle}>Validate Secure Account</Text>
              <Input
                name={this.state.tokenKey}
                value={this.state.tokenKey}
                placeholder="Enter Token Key"
                keyboardType={"numeric"}
                placeholderTextColor={Platform.OS == "ios" ? "#fff" : "#000"}
                style={styles.input}
                onChangeText={val => this.validation(val)}
                onChange={val => this.validation(val)}
              />
            </View>
            <View style={styles.viewValidBtn}>
              <Button
                style={[
                  styles.btnSent,
                  { backgroundColor: this.state.validBtnBgColor }
                ]}
                full
                disabled={this.state.validBtnStaus}
                onPress={() => this.click_Validation()}
              >
                <Text> VALIDATION </Text>
              </Button>
            </View>
          </Content>
        </ImageBackground>
        {renderIf(this.state.isLoading)(
          <View style={styles.loading}>
            <SkypeIndicator color={colors.appColor} />
          </View>
        )}
        <SCLAlertOk
          data={this.state.alertPopupData}
          click_Ok={(status: boolean) => {
            status
              ? this.props.navigation.navigate("TabbarBottom")
              : console.log(status),
              this.setState({
                alertPopupData: [
                  {
                    status: false
                  }
                ]
              });
          }}
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1
  },
  logoSecureAccount: {
    flex: 2,
    alignItems: "center"
  },
  input: {
    marginTop: 10,
    width: width / 1.1,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    color: Platform.OS == "ios" ? "#fff" : "#000"
  },
  secureLogo: {
    height: 120,
    width: 120
  },
  txtTitle: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 24
  },
  //view:createAccountBtn
  viewValidBtn: {
    flex: 3,
    marginTop: 20
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
