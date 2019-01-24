import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  StatusBar,
  Alert,
  ImageBackground,
  RefreshControl
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
  List,
  ListItem,
  Thumbnail,
  Footer
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
  MenuProvider,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from "react-native-popup-menu";
import DropdownAlert from "react-native-dropdownalert";

//TODO: Custome Pages
import { colors, images, localDB } from "../../../app/constants/Constants";
var dbOpration = require("../../../app/manager/database/DBOpration");
var utils = require("../../../app/constants/Utils");
import renderIf from "../../../app/constants/validation/renderIf";

let isNetwork;
//Custome Compontes
import ViewRecentTransaction from "../../../app/custcompontes/view/ViewRecentTransaction";
import SCLAlertTransferAccountAmount from "../../../app/custcompontes/alert/SCLAlertTransferAccountAmount";
import SCLAlertSimpleConfirmation from "../../../app/custcompontes/alert/SCLAlertSimpleConfirmation";
import SCLAlertOk from "../../../app/custcompontes/alert/SCLAlertOk";

//TODO: Wallets
import RegularAccount from "../../../bitcoin/services/RegularAccount";

interface Props {}

interface State {}

export default class AccountDetailsScreen extends React.Component<
  Props,
  State
> {
  constructor(props: any) {
    super(props);
    StatusBar.setBackgroundColor(colors.appColor, true);
    this.state = {
      data: [],
      waletteData: [],
      recentTransactionData: [],
      transferAmountPopupDAta: [],
      confirmPopupData: [],
      successOkPopupData: [],
      tranDetails: [],
      refreshing: false,
      isLoading: false,
      isNoTranstion: false,
      //transfer
      isTransferBtn: false,
      arr_TransferAccountData: []
    };
    isNetwork = utils.getNetwork();
  }

  //TODO: Page Life Cycle
  componentWillMount() {
    const { navigation } = this.props;
    console.log("data =" + JSON.stringify(navigation.getParam("data")));
    this.setState({
      data: navigation.getParam("data"),
      waletteData: navigation.getParam("privateKeyJson")[
        navigation.getParam("indexNo")
      ]
    });
  }

  componentDidMount() {
    this.willFocusSubscription = this.props.navigation.addListener(
      "willFocus",
      () => {
        isNetwork = utils.getNetwork();
        this.fetchloadData();
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  //TODO: func loadData
  async fetchloadData() {
    const { navigation } = this.props;
    let isLoading: boolean = true;
    let isNoTranstion: boolean = false;
    let tranDetails: [] = [];
    let title: string =
      navigation.getParam("data").accountType + " Recent Transactions";
    const dateTime = Date.now();
    const lastUpdateDate = Math.floor(dateTime / 1000);

    const resultAccount = await dbOpration.readAccountTablesData(
      localDB.tableName.tblAccount
    );
    if (isNetwork) {
      //TODO: for transfer btn and details
      if (resultAccount.temp.length > 2) {

        this.setState({
          isTransferBtn:true,

        })
      }

      const bal = await RegularAccount.getBalance(
        navigation.getParam("data").address
      );
      if (bal.statusCode == 200) {
        const resultRecentTras = await RegularAccount.getTransactions(
          navigation.getParam("data").address
        );
        if (resultRecentTras.statusCode == 200) {
          if (resultRecentTras.transactionDetails.length > 0) {
            const resultRecentTransaction = await dbOpration.insertTblTransation(
              localDB.tableName.tblTransaction,
              resultRecentTras.transactionDetails,
              resultRecentTras.address,
              lastUpdateDate
            );
            if (resultRecentTransaction) {
              let transation;
              let flag_noTrasation;
              const resultRecentTras = await dbOpration.readRecentTransactionAddressWise(
                localDB.tableName.tblTransaction,
                navigation.getParam("data").address
              );
              if (resultRecentTras.temp.length > 0) {
                transation = resultRecentTras.temp;
                flag_noTrasation = false;
              } else {
                transation = [];
                flag_noTrasation = true;
              }
              tranDetails = transation;
              isNoTranstion = flag_noTrasation;
            }
          } else {
            isNoTranstion = true;
          }
          const resultUpdateTblAccount = await dbOpration.updateTableData(
            localDB.tableName.tblAccount,
            bal.final_balance / 1e8,
            navigation.getParam("data").address,
            lastUpdateDate
          );
          if (resultUpdateTblAccount) {
            isLoading = false;
            this.setState({
              data: resultAccount.temp[navigation.getParam("indexNo")]
            });
          }
        } else {
          this.dropdown.alertWithType(
            "error",
            "OH!!",
            resultRecentTras.errorMessage
          );
        }
      }
    } else {
      isLoading = false;
      let transation;
      let flag_noTrasation;
      const resultRecentTras = await dbOpration.readRecentTransactionAddressWise(
        localDB.tableName.tblTransaction,
        navigation.getParam("data").address
      );
      if (resultRecentTras.temp.length > 0) {
        transation = resultRecentTras.temp;
        flag_noTrasation = false;
      } else {
        transation = [];
        flag_noTrasation = true;
      }
      tranDetails = transation;
      isNoTranstion = flag_noTrasation;

      this.setState({
        data: resultAccount.temp[navigation.getParam("indexNo")]
      });
    }

    this.setState({
      recentTransactionData: [
        {
          title,
          isLoading1: isLoading,
          isNoTranstion,
          tranDetails
        }
      ]
    });
  }

  //TODO: func refresh
  refresh() {
    this.setState({ refreshing: true });
    return new Promise(resolve => {
      setTimeout(() => {
        this.setState({ refreshing: false });
        this.fetchloadData();
        resolve();
      }, 1000);
    });
  }
  //TODO: func openRecentTrans
  openRecentTrans(item) {
    this.props.navigation.navigate("RecentTransactionsScreen", {
      transationDetails: item
    });
  }

  render() {
    return (
      <Container style={styles.container}>
        <Content
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.refresh.bind(this)}
            />
          }
        >
          <ImageBackground
            source={images.accounts[this.state.data.accountType]}
            style={styles[this.state.data.accountType]}
            borderRadius={10}
            imageStyle={{
              resizeMode: "cover" // works only here!
            }}
          >
            <View style={styles.viewBackBtn}>
              <Left>
                <Button
                  transparent
                  onPress={() => this.props.navigation.goBack()}
                >
                  <Icon name="chevron-left" size={25} color="#ffffff" />
                </Button>
              </Left>
              <Right>
                <MenuProvider>
                  <Menu style={{ marginTop: 10, color: "#ffffff" }}>
                    <MenuTrigger
                      customStyles={{
                        triggerText: { fontSize: 18, color: "#fff" }
                      }}
                      text="options"
                    />
                    <MenuOptions customStyles={{ optionText: styles.text }}>
                      <MenuOption onSelect={() => alert(`Save`)} text="Save" />
                      <MenuOption onSelect={() => alert(`Delete`)}>
                        <Text style={{ color: "red" }}>Delete</Text>
                      </MenuOption>
                    </MenuOptions>
                  </Menu>
                </MenuProvider>
              </Right>
            </View>
            <View style={styles.viewBalInfo}>
              <Text style={[styles.txtTile, styles.txtAccountType]}>
                {this.state.data.accountType}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={[styles.txtTile, styles.txtBalInfo]}>
                  {this.state.data.balance + " "}
                </Text>
                <Text style={[styles.txtTile, styles.txtBalInfo]}>
                  {this.state.data.unit}
                </Text>
              </View>
            </View>
          </ImageBackground>
          <View style={styles.viewMainRecentTran}>
            <ViewRecentTransaction
              data={this.state.recentTransactionData}
              openRecentTrans={(val: any) => this.openRecentTrans(val)}
            />
          </View>

          <View style={styles.viewFooter}>
            <View
              style={{
                backgroundColor: colors.appColor,
                flexDirection: "row",
                paddingLeft: 20,
                paddingRight: 10,
                borderRadius: 5
              }}
            >
              {renderIf(this.state.isTransferBtn)(
                <Button
                  transparent
                  onPress={() => {
                    if (isNetwork) {
                      this.setState({
                        transferAmountPopupDAta: [
                          {
                            status: true,
                            subtitle: "Savings to",
                            data: [
                              {
                                name: "Secure"
                              },
                              {
                                name: "Vault"
                              }
                            ]
                          }
                        ]
                      });
                    } else {
                      this.dropdown.alertWithType(
                        "info",
                        "OH!!",
                        "Sorry You're Not Connected to the Internet"
                      );
                    }
                  }}
                >
                  <Icon name="exchange-alt" size={25} color="#ffffff" />
                  <Text style={styles.txtTile}>TRANSFER</Text>
                </Button>
              )}
              <Button
                transparent
                onPress={() => {
                  if (isNetwork) {
                    this.props.navigation.push("SentMoneyScreen", {
                      data: this.state.data,
                      address: this.state.data.address,
                      privateKey: this.state.waletteData.privateKey
                    });
                  } else {
                    this.dropdown.alertWithType(
                      "info",
                      "OH!!",
                      "Sorry You're Not Connected to the Internet"
                    );
                  }
                }}
              >
                <Icon name="angle-up" size={25} color="#ffffff" />
                <Text style={styles.txtTile}>Send</Text>
              </Button>
              <Button
                transparent
                onPress={() =>
                  this.props.navigation.push("ReceiveMoneyScreen", {
                    address: this.state.data.address
                  })
                }
              >
                <Icon name="angle-down" size={25} color="#ffffff" />
                <Text style={styles.txtTile}>Receive</Text>
              </Button>
            </View>
          </View>
        </Content>
        <SCLAlertTransferAccountAmount
          data={this.state.transferAmountPopupDAta}
          onRequestClose={() =>
            this.setState({ transferAmountPopupDAta: [{ status: false }] })
          }
          onPress={(val, amount, msg) => {
            this.setState({
              transferAmountPopupDAta: [
                {
                  status: false
                }
              ],
              confirmPopupData: [
                {
                  status: true,
                  icon: "check-circle",
                  title: "Confirmation",
                  subtitle: msg,
                  confirmTitle: "CONFIRM"
                }
              ]
            });
          }}
          onError={error => {
            this.dropdown.alertWithType("error", "OH!!", error);
          }}
        />
        <SCLAlertSimpleConfirmation
          data={this.state.confirmPopupData}
          click_Ok={(status: boolean) => {
            if (status) {
              this.setState({
                successOkPopupData: [
                  {
                    theme: "success",
                    status: true,
                    icon: "smile",
                    title: "Success!!",
                    subtitle: "Amount Transfer successfully.",
                    goBackStatus: false
                  }
                ]
              });
            }
            this.setState({
              confirmPopupData: [
                {
                  status: false
                }
              ]
            });
          }}
        />
        <SCLAlertOk
          data={this.state.successOkPopupData}
          click_Ok={(status: boolean) =>
            this.setState({
              successOkPopupData: [
                {
                  status: false
                }
              ]
            })
          }
        />
        <DropdownAlert ref={ref => (this.dropdown = ref)} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  Savings: {
    flex: 1,
    backgroundColor: colors.Saving,
    width: "100%"
  },
  Secure: {
    flex: 1,
    backgroundColor: colors.Secure,
    width: "100%"
  },
  viewBackBtn: {
    flex: 2,
    flexDirection: "row",
    padding: 15,
    marginTop: Platform.OS == "ios" ? 10 : 25
  },
  viewBalInfo: {
    flex: 5,
    flexDirection: "column",

    padding: 15
  },
  //txtbal info
  txtTile: {
    color: "#ffffff"
  },
  txtAccountType: {
    fontSize: 20,
    fontWeight: "bold"
  },
  txtBalInfo: {
    fontSize: 28,
    fontWeight: "bold"
  },
  //Recent Transaction
  viewMainRecentTran: {
    flex: 2
  },
  viewTitleRecentTrans: {
    marginLeft: 20,
    flexDirection: "row",
    flex: 0.2,
    alignItems: "center"
  },
  //Loading
  loading: {
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center"
  },
  txtRecentTran: {
    fontWeight: "bold",
    fontSize: 25,
    marginTop: 10
  },
  txtTransTitle: {
    fontWeight: "bold",
    marginBottom: 5
  },
  txtAmoundRec: {
    color: "#228B22",
    fontWeight: "bold"
  },
  txtAmoundSent: {
    color: "red",
    fontWeight: "bold"
  },
  recentTransListView: {
    flex: 1
  },
  //No Transaction
  viewNoTransaction: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20
  },
  txtNoTransaction: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 5
  },
  //TODO:Fotter view
  viewFooter: {
    flex: 0.3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  txtConfimation: {
    fontSize: 10,
    color: "gray"
  },
  //PopupMenu
  text: {
    fontSize: 18
  }
});
