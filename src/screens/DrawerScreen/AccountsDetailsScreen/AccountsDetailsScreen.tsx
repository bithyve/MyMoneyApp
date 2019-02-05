import React from "react";
import {
  Platform,
  StyleSheet,
  View,
  StatusBar,
  ImageBackground,
  RefreshControl
} from "react-native";
import { Container, Content, Button, Left, Right, Text } from "native-base";
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
import moment from "moment";

let isNetwork: boolean;
//Custome Compontes
import ViewRecentTransaction from "../../../app/custcompontes/view/ViewRecentTransaction";
import SCLAlertTransferAccountAmount from "../../../app/custcompontes/alert/SCLAlertTransferAccountAmount";
import SCLAlertSimpleConfirmation from "../../../app/custcompontes/alert/SCLAlertSimpleConfirmation";
import SCLAlertOk from "../../../app/custcompontes/alert/SCLAlertOk";

//TODO: Wallets
import RegularAccount from "../../../bitcoin/services/RegularAccount";
import jointAccount from "../../../bitcoin/services/JointAccount";

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
      arr_transferAccountList: [],
      refreshing: false,
      isLoading: false,
      isNoTranstion: false,
      //transfer
      flag_TransferBtn: false,
      flag_sentBtnDisStatus: true,
      arr_TransferAccountData: []
    };
    isNetwork = utils.getNetwork();
  }

  //TODO: Page Life Cycle
  componentWillMount() {
    const { navigation } = this.props;
    let data = navigation.getParam("data");
    let walletsData = navigation.getParam("walletsData");
    console.log({ data, walletsData });
    this.setState({
      data: data,
      waletteData: walletsData
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

  date_diff_indays(date1, date2) {
    dt1 = new Date(date1);
    dt2 = new Date(date2);
    return Math.floor(
      (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
        Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
        (1000 * 60 * 60 * 24)
    );
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
    var resultAccount = await dbOpration.readAccountTablesData(
      localDB.tableName.tblAccount
    );
    if (isNetwork) {
      //TODO: for transfer and sent btn disable and enable details
      if (
        resultAccount.temp.length > 2 &&
        parseFloat(this.state.data.balance) > 0
      ) {
        var resultAccount = await dbOpration.readAccountTablesData(
          localDB.tableName.tblAccount
        );
        resultAccount.temp.pop();
        for (var i = 0; i < resultAccount.temp.length; i++) {
          if (
            resultAccount.temp[i].accountType === this.state.data.accountType
          ) {
            resultAccount.temp.splice(i, 1);
            break;
          }
        }
        var isTransBtnStatus: boolean = false;
        if (this.state.data.accountType != "Vault") {
          isTransBtnStatus = true;
        } else {
          let additionalInfo = JSON.parse(this.state.data.additionalInfo);
          let validDate = moment(
            utils.getUnixToDateFormat(additionalInfo.validDate)
          );
          var start = moment(new Date()).format("DD-MM-YYYY");
          var end = moment(validDate).format("DD-MM-YYYY");
          let diffDays: number = parseInt(this.date_diff_indays(start, end));

          console.log({ diffDays });

          if (diffDays <= 0) {
            isTransBtnStatus = true;
          }
        }
        this.setState({
          arr_transferAccountList: resultAccount.temp,
          flag_TransferBtn: isTransBtnStatus
        });
      }
      if (parseFloat(this.state.data.balance) > 0) {
        if (this.state.data.accountType != "Vault") {
          this.setState({
            flag_sentBtnDisStatus: false
          });
        } else {
          let additionalInfo = JSON.parse(this.state.data.additionalInfo);
          let validDate = moment(
            utils.getUnixToDateFormat(additionalInfo.validDate)
          );
          var start = moment(new Date()).format("DD-MM-YYYY");
          var end = moment(validDate).format("DD-MM-YYYY");
          let diffDays: number = parseInt(this.date_diff_indays(start, end));
          if (diffDays <= 0) {
            this.setState({
              flag_sentBtnDisStatus: false
            });
          }
        }
      }

      //TODO: Account Bal checking
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
            resultAccount = await dbOpration.readAccountTablesData(
              localDB.tableName.tblAccount
            );
            if (resultAccount.temp.length > 0) {
              isLoading = false;
              this.setState({
                data: resultAccount.temp[navigation.getParam("indexNo")]
              });
            }
          }
        } else {
          this.dropdown.alertWithType(
            "error",
            "OH",
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

  //TODO: func connection_BarcodeRead
  onSelect = async data => {
    const txHex = data.barcode;
    console.log(JSON.stringify(this.state.waletteData));
    let privateKey = this.state.waletteData[0].privateKey;

    const res = await jointAccount.authorizeJointTxn(txHex, privateKey);
    if (res.statusCode == 200) {
      this.setState({
        successOkPopupData: [
          {
            theme: "success",
            status: true,
            icon: "smile",
            title: "Success",
            subtitle: "Transaction Successfully Completed.",
            goBackStatus: true
          }
        ]
      });
    }
  };

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
              {renderIf(this.state.data.accountType == "Joint")(
                <Right>
                  <MenuProvider>
                    <Menu
                      style={{
                        marginTop: 10,
                        color: "#ffffff",
                        marginRight: 10
                      }}
                    >
                      <MenuTrigger
                        customStyles={{
                          triggerText: { fontSize: 18, color: "#fff" }
                        }}
                        text="options"
                      />
                      <MenuOptions
                        customStyles={{ optionText: styles.menuOptions }}
                      >
                        <MenuOption
                          onSelect={() => {
                            this.props.navigation.push("QrcodeScannerScreen", {
                              onSelect: this.onSelect
                            });
                          }}
                          text="Authorize Transaction"
                        />
                      </MenuOptions>
                    </Menu>
                  </MenuProvider>
                </Right>
              )}
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
            {renderIf(this.state.flag_TransferBtn)(
              <Button
                style={styles.footerBtnAction}
                warning
                onPress={() => {
                  if (isNetwork) {
                    this.setState({
                      transferAmountPopupDAta: [
                        {
                          status: true,
                          subtitle:
                            "From " +
                            this.state.data.accountType.toLowerCase() +
                            " to",
                          data: this.state.arr_transferAccountList
                        }
                      ]
                    });
                  } else {
                    this.dropdown.alertWithType(
                      "info",
                      "OH",
                      "Sorry You're Not Connected to the Internet"
                    );
                  }
                }}
              >
                <Icon
                  style={styles.footerBtnIcon}
                  name="exchange-alt"
                  size={25}
                  color="#ffffff"
                />
                <Text style={styles.txtTile}>TRANSFER</Text>
              </Button>
            )}
            <Button
              warning
              style={styles.footerBtnAction}
              disabled={this.state.flag_sentBtnDisStatus}
              onPress={() => {
                if (isNetwork) {
                  this.props.navigation.push("SentMoneyScreen", {
                    data: this.state.data,
                    address: this.state.data.address,
                    waletteData: this.state.waletteData
                  });
                } else {
                  this.dropdown.alertWithType(
                    "info",
                    "OH",
                    "Sorry You're Not Connected to the Internet"
                  );
                }
              }}
            >
              <Icon
                style={styles.footerBtnIcon}
                name="angle-up"
                size={25}
                color="#ffffff"
              />
              <Text style={styles.txtTile}>Send</Text>
            </Button>
            <Button
              style={styles.footerBtnAction}
              warning
              onPress={() => {
                let data = {};
                data.address = this.state.data.address;
                this.props.navigation.push("ReceiveMoneyScreen", {
                  page: "SentAndReceiveScreen",
                  data: data
                });
              }}
            >
              <Icon
                style={styles.footerBtnIcon}
                name="angle-down"
                size={25}
                color="#ffffff"
              />
              <Text style={styles.txtTile}>Receive</Text>
            </Button>
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
            this.dropdown.alertWithType("error", "OH", error);
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
                    title: "Success",
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
          click_Ok={(status: boolean) => {
            this.fetchloadData();
            this.setState({
              successOkPopupData: [
                {
                  status: false
                }   
              ]
            });
          }}
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
  Vault: {
    flex: 1,
    backgroundColor: colors.Vault,
    width: "100%"
  },
  Joint: {
    flex: 1,
    backgroundColor: colors.Joint,
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
  },
  //Fotter Button
  footerBtnIcon: {
    paddingLeft: 10
  },
  footerBtnAction: {
    marginLeft: 2,
    marginRight: 2
  },
  //menuoption
  menuOptions: {
    fontSize: 14,
    marginRight: 60
  }
});
