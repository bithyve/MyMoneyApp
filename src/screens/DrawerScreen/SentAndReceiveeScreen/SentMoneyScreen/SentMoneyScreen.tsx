import React from "react";
import {
  StyleSheet,
  ImageBackground,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  TextInput
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
  Input,
  Form,
  Item,
  Label
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { SkypeIndicator } from "react-native-indicators";
import Dialog, {
  SlideAnimation,
  DialogTitle,
  DialogContent,
  DialogButton
} from "react-native-popup-dialog";

const required = value => (value ? undefined : "This is a required field.");
const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,5}$/i.test(value)
    ? "Please provide a valid email address."
    : undefined;

//Custome Compontes
import SCLAlertOk from "../../../../app/custcompontes/alert/SCLAlertOk";

//TODO: Custome Object
import { colors, images, localDB } from "../../../../app/constants/Constants";
var dbOpration = require("../../../../app/manager/database/DBOpration");
import renderIf from "../../../../app/constants/validation/renderIf";

//TODO: Wallets
import RegularAccount from "../../../../bitcoin/services/RegularAccount";

export default class SentMoneyScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      alertPopupData: [],
      recipientAddress: "",
      amount: "",
      sentBtnColor: "gray",
      sentBtnStatus: true,
      isLoading: false,
      isSecureAccountPopup: false
    };
  }

  componentWillMount() {
    const { navigation } = this.props;
    this.setState({
      data: navigation.getParam("data")
    });
  }

  //TODO: func validation
  validation(val, type) {
    if (type == "address") {
      this.setState({
        recipientAddress: val
      });
    } else {
      this.setState({
        amount: val
      });
    }
    if (
      this.state.recipientAddress.length > 0 &&
      this.state.amount.length > 0
    ) {
      this.setState({
        sentBtnColor: colors.appColor,
        sentBtnStatus: false
      });
    }
    if (
      this.state.recipientAddress.length < 0 ||
      this.state.amount.length < 0 ||
      val == ""
    ) {
      this.setState({
        sentBtnColor: "gray",
        sentBtnStatus: true
      });
    }
  }
   

  
  //TODO: func click_SentMoney
  async click_SentMoney() {
    if (this.state.data.accountType == "Secure") {
      this.setState({ isSecureAccountPopup: true });
    } else {
      this.setState({
        isLoading: true
      });
      var recAddress = this.state.recipientAddress;
      var amountValue = this.state.amount;
      console.log("first amount=", amountValue);
      const dateTime = Date.now();
      const lastUpdateDate = Math.floor(dateTime / 1000);
      const { navigation } = this.props;
      console.log("address =  " + navigation.getParam("address"));
      console.log("keypair = " + navigation.getParam("privateKey"));
      const { success, txid } = await RegularAccount.transfer(
        navigation.getParam("address"),
        recAddress,
        parseFloat(amountValue) * 1e8,
        navigation.getParam("privateKey")
      );
      if (success) {
        const bal = await RegularAccount.getBalance(
          navigation.getParam("address")
        );
        if (bal) {
          console.log("change bal = ", bal);
          const resultUpdateTblAccount = await dbOpration.updateTableData(
            localDB.tableName.tblAccount,
            bal.final_balance / 1e8,
            navigation.getParam("address"),
            lastUpdateDate
          );
          if (resultUpdateTblAccount) {
            this.setState({
              alertPopupData: [
                {
                  theme: "success",
                  status: true,
                  icon: "smile",
                  title: "Success!!",
                  subtitle: "Transaction Successfully Completed.",
                  goBackStatus: true
                }
              ]
            });
          } else {
            this.setState({
              alertPopupData: [
                {
                  theme: "danger",
                  status: true,
                  icon: "frown",
                  title: "Oops!!",
                  subtitle: "Transaction Not Completed.",
                  goBackStatus: false
                }
              ]
            });
          }
        }
      }
    }
  }

  //TODO: func openQRCodeScanner
  openQRCodeScanner() {
    //  this.props.navigation.push('QrcodeScannerScreen');
    this.props.navigation.navigate("QrcodeScannerScreen", {
      onSelect: this.onSelect
    });
  }

  onSelect = data => {
    this.setState({
      recipientAddress: data.barcode
    });
  };

  render() {
    return (
      <Container>
        <ImageBackground source={images.appBackgound} style={styles.container}>
          <Header transparent>
            <Left>
              <Button
                transparent
                onPress={() => this.props.navigation.goBack()}
              >
                <Icon name="chevron-left" size={25} color="#ffffff" />
              </Button>
            </Left>

            <Body>
              <Title
                adjustsFontSizeToFit={true}
                numberOfLines={1}
                style={styles.txtTitle}
              >
                Send Money
              </Title>
            </Body>
            <Right />
          </Header>
          <Content padder>
            <View style={styles.selectQRCodeOption}>
              <Input
                name={this.state.recipientAddress}
                value={this.state.recipientAddress}
                keyboardType={"default"}
                placeholder="Address"
                placeholderTextColor="#ffffff"
                style={styles.input}
                onChangeText={val => this.validation(val, "address")}
                onChange={val => this.validation(val, "address")}
              />
              <TouchableOpacity onPress={() => this.openQRCodeScanner()}>
                <Icon
                  style={{ alignItems: "flex-end", justifyContent: "flex-end" }}
                  name="barcode"
                  size={35}
                  color={"#000000"}
                />
              </TouchableOpacity>
            </View>
            <View>
              <Input
                name={this.state.amount}
                value={this.state.amount}
                placeholder="Amount (BTC)"
                placeholderTextColor="#ffffff"
                style={styles.input}
                onChangeText={val => this.validation(val, "amount")}
                onChange={val => this.validation(val, "amount")}
              />
            </View>
            <Button
              style={[
                styles.btnSent,
                { backgroundColor: this.state.sentBtnColor }
              ]}
              full
              disabled={this.state.sentBtnStatus}
              onPress={() => this.click_SentMoney()}
            >
              <Text> SEND </Text>
            </Button>
          </Content>

          <Dialog
            width={Dimensions.get("screen").width - 30}
            visible={this.state.isSecureAccountPopup}
            onTouchOutside={() => {
              this.setState({ isSecureAccountPopup: false });
            }}
            dialogAnimation={
              new SlideAnimation({
                slideFrom: "bottom"
              })
            }
            dialogStyle={styles.dialogSecureAccount}
          >
            <DialogContent containerStyle={styles.dialogContainerSecureAccount}>
              <View style={styles.accountTypePopUP}>
                <Text style={[styles.txtTitle, { fontSize: 20 }]}>
                  New Transaction
                </Text>

                <View style={styles.viewFeeShow}>
                  <View style={[styles.viewLineText]}>
                    <Text style={[styles.txtTitle, { flex: 1 }]}>Amount:</Text>
                    <Text
                      style={[styles.txtTitle, { flex: 1, fontWeight: "bold" }]}
                    >
                      $ {this.state.amount}
                    </Text>
                  </View>
                  <View style={[styles.viewLineText]}>
                    <Text style={[styles.txtTitle, { flex: 1 }]}>Fee:</Text>
                    <Text
                      style={[styles.txtTitle, { flex: 1, fontWeight: "bold" }]}
                    >
                      $ 0.001
                    </Text>
                  </View>
                </View>

                <View style={styles.viewReceipint}>
                  <Text style={[styles.txtTitle, { fontSize: 18 }]}>
                    Recipient:
                  </Text>
                  <Text
                    style={[
                      styles.txtTitle,
                      { textAlign: "center", fontSize: 18, fontWeight: "bold" }
                    ]}
                  >
                    {this.state.recipientAddress}
                  </Text>
                </View>

                <View style={styles.view2FaInput}>
                  <TextInput
                    name={this.state.txt2FA}
                    value={this.state.txt2FA}
                    keyboardType={"default"}
                    placeholder="2FA gauth code"
                    placeholderTextColor="#EA4336"
                    style={styles.input2FA}
                  />
                </View>
                <View style={styles.viewBtn}>
                  <Button
                    transparent
                    danger
                    onPress={() =>
                      this.setState({ isSecureAccountPopup: false })
                    }
                  >
                    <Text>CANCEL</Text>
                  </Button>
                  <Button
                    transparent
                    danger
                    onPress={() => {
                      this.setState({ isSecureAccountPopup: false });
                      alert("working");
                    }}
                  >
                    <Text>SEND</Text>
                  </Button>
                </View>
              </View>
            </DialogContent>
          </Dialog>

          {renderIf(this.state.isLoading)(
            <View style={styles.loading}>
              <SkypeIndicator color={colors.appColor} />
            </View>
          )}
        </ImageBackground>
        <SCLAlertOk
          data={this.state.alertPopupData}
          click_Ok={(status: boolean) => {
            status ? this.props.navigation.goBack() : console.log(status),
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
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  txtTitle: {
    color: "#ffffff"
  },
  btnSent: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.appColor
  },
  //QRCode select option
  selectQRCodeOption: {
    flexDirection: "row"
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    color: "#ffffff"
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
  },
  //For flip
  flipCard: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "blue",
    backfaceVisibility: "hidden"
  },
  flipCardBack: {
    backgroundColor: "red",
    position: "absolute",
    top: 0
  },
  flipText: {
    width: 90,
    fontSize: 20,
    color: "white",
    fontWeight: "bold"
  },
  //popup
  dialogSecureAccount: {
    borderRadius: 5,
    backgroundColor: "#1F1E25"
  },
  dialogContainerSecureAccount: {},
  accountTypePopUP: {
    padding: 10,
    marginTop: 20
  },
  viewFeeShow: {
    marginTop: 20,
    marginBottom: 10
  },
  viewLineText: {
    flexDirection: "row"
  },
  viewReceipint: {},
  view2FaInput: {
    marginTop: 20
  },
  input2FA: {
    borderBottomWidth: 1,
    borderBottomColor: "#EA4336",
    color: "#EA4336",
    fontSize: 18
  },
  //view:Button
  viewBtn: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
    justifyContent: "flex-end"
  }
});
