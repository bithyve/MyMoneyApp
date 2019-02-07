import React from "react";
import {
  Platform,
  StyleSheet,
  View,
  StatusBar,
  ImageBackground,
  RefreshControl,
  Dimensions,
  TextInput
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
import Dialog, {
  SlideAnimation,
  DialogContent
} from "react-native-popup-dialog";

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
import SCLAlertJointAccountAuthoriseConfirmation from "../../../app/custcompontes/alert/SCLAlertJointAccountAuthoriseConfirmation";

//TODO: Wallets
import RegularAccount from "../../../bitcoin/services/RegularAccount";
import jointAccount from "../../../bitcoin/services/JointAccount";
import secureAccount from "../../../bitcoin/services/SecureAccount";
import vaultAccount from "../../../bitcoin/services/VaultAccount";

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
      arr_TransferAccountData: [],
      arr_ConfirmJointAccountAuthorise: [],
      transactionHax: "",
      flag_SecureAccountPopup: false,
      txt2FA: "",
      secureAmount: "",
      secureRecipientAddress: "",
      securetransfer: {}
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
            isTransBtnStatus = false; //old code true
          }  
        }

        let tempData = resultAccount.temp;
        console.log({ tempData });

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

    let res = await jointAccount.recoverTxnDetails(txHex);
    console.log({ res });
    let additionalInfo = JSON.parse(this.state.data.additionalInfo);
    let jointData = additionalInfo.jointData;
    this.setState({
      transactionHax: txHex,
      arr_ConfirmJointAccountAuthorise: [
        {
          status: true,
          icon: "check-circle",
          title: "Confirmation",
          subtitle: `${
            jointData.cn
          } has initiated the following transaction from ${
            jointData.wn
          } joint accounts`,
          form: res.from,
          to: res.to,
          amount: res.amount,
          transFee: res.txnFee,
          confirmTitle: "AUTHORISE"
        }
      ]
    });
  };

  //TODO: func connection_SentJointAccountMoney
  async connection_SentJointAccountMoney() {
    let privateKey = this.state.waletteData[0].privateKey;

    console.log(privateKey, this.state.transactionHax);

    const res = await jointAccount.authorizeJointTxn(
      this.state.transactionHax,
      privateKey
    );
    console.log({ res });
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
  }

  //TODO: func click_SecureAccountSendMoney
  async click_SecureAccountSendMoney() {
    let additionalInfo = JSON.parse(this.state.data.additionalInfo);
    console.log({ additionalInfo });
    const transfer = this.state.securetransfer;
    const res = await secureAccount.secureTransaction({
      senderAddress: transfer.senderAddress,
      recipientAddress: transfer.recipientAddress,
      amount: transfer.amount,
      primaryXpriv: additionalInfo.xpriv.primary,
      scripts: additionalInfo.multiSig.scripts,
      token: this.state.txt2FA,
      walletID: additionalInfo.walletID,
      childIndex: 0
    });

    if (res.statusCode == 200) {
      this.setState({
        flag_SecureAccountPopup: false,
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
                {this.state.data.accountName}
              </Text>
              {renderIf(this.state.data.accountType == "Joint")(
                <Text style={styles.txtTile}>Joint Account</Text>
              )}
              <View style={{ flexDirection: "row", marginTop: 10 }}>
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

          <SCLAlertTransferAccountAmount
            data={this.state.transferAmountPopupDAta}
            onRequestClose={() =>
              this.setState({ transferAmountPopupDAta: [{ status: false }] })
            }
            onPress={async (accountType, amount, address, msg) => {
              let selfAddress = this.state.data.address;
              let privateKey = this.state.waletteData[0].privateKey;
              console.log({
                selfAddress,
                privateKey,
                accountType,
                amount,
                address,
                msg
              });
              const transfer = {
                senderAddress: selfAddress,
                recipientAddress: address,
                amount: parseFloat(amount) * 1e8,
                privateKey
              };
              if (this.state.data.accountType == "Savings") {
                const res = await RegularAccount.transfer(
                  transfer.senderAddress,
                  transfer.recipientAddress,
                  transfer.amount,
                  transfer.privateKey
                );
                if (res.statusCode == 200) {
                  this.setState({
                    transferAmountPopupDAta: [
                      {
                        status: false
                      }   
                    ],
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
              } else if (this.state.data.accountType == "Vault") {
                // let additionalInfo = JSON.parse(this.state.data.additionalInfo);
                // const locktime = additionalInfo.lockTime;
                // const res = await vaultAccount.transfer(
                //   transfer.senderAddress,
                //   transfer.recipientAddress,
                //   transfer.amount,
                //   locktime,
                //   transfer.privateKey
                // );
                // console.log({ res });
              } else if (this.state.data.accountType == "Secure") {
                this.setState({
                  securetransfer: transfer,
                  transferAmountPopupDAta: [
                    {
                      status: false
                    }
                  ],
                  secureAmount: amount,
                  secureRecipientAddress: address,
                  flag_SecureAccountPopup: true
                });
              } else if (this.state.data.accountType == "Joint") {
                const additionalInfo = JSON.parse(
                  this.state.data.additionalInfo
                );
                console.log({ additionalInfo });
                const scripts = additionalInfo.scripts;
                const res = await jointAccount.initJointTxn({
                  senderAddress: transfer.senderAddress,
                  recipientAddress: transfer.recipientAddress,
                  amount: transfer.amount,
                  privateKey,
                  scripts
                });
                this.setState({
                  transferAmountPopupDAta: [
                    {
                      status: false
                    }
                  ]
                });
                this.props.navigation.push("ReceiveMoneyScreen", {
                  page: "AccountDetailsScreen",
                  data: res.data
                });
              }

              // this.setState({
              //   transferAmountPopupDAta: [
              //     {
              //       status: false
              //     }
              //   ],
              //   confirmPopupData: [
              //     {
              //       status: true,
              //       icon: "check-circle",
              //       title: "Confirmation",
              //       subtitle: msg,
              //       confirmTitle: "CONFIRM"
              //     }
              //   ]
              // });
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

          <SCLAlertJointAccountAuthoriseConfirmation
            data={this.state.arr_ConfirmJointAccountAuthorise}
            click_Ok={(status: boolean) => {
              if (status) {
                this.connection_SentJointAccountMoney();
              }
              this.setState({
                arr_ConfirmJointAccountAuthorise: [
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

          <Dialog
            width={Dimensions.get("screen").width - 30}
            visible={this.state.flag_SecureAccountPopup}
            onTouchOutside={() => {
              this.setState({ flag_SecureAccountPopup: false });
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
                      $ {this.state.secureAmount}
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
                    {this.state.secureRecipientAddress}
                  </Text>
                </View>
                <View style={styles.view2FaInput}>
                  <TextInput
                    name={this.state.txt2FA}
                    value={this.state.txt2FA}
                    ref="txtInpAccountBal"
                    autoFocus={true}
                    keyboardType={"numeric"}
                    returnKeyType={"next"}
                    placeholder="2FA gauth token"
                    placeholderTextColor="#EA4336"
                    style={styles.input2FA}
                    onChangeText={val => this.setState({ txt2FA: val })}
                    onChange={val => this.setState({ txt2FA: val })}
                  />
                </View>
                <View style={styles.viewBtn}>
                  <Button
                    transparent
                    danger
                    onPress={() =>
                      this.setState({ flag_SecureAccountPopup: false })
                    }
                  >
                    <Text>CANCEL</Text>
                  </Button>
                  <Button
                    transparent
                    danger
                    onPress={() => this.click_SecureAccountSendMoney()}
                  >
                    <Text>SEND</Text>
                  </Button>
                </View>
              </View>
            </DialogContent>
          </Dialog>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  Savings: {
    flex: 14,
    backgroundColor: colors.Saving,
    width: "100%"
  },
  Secure: {
    flex: 14,
    backgroundColor: colors.Secure,
    width: "100%"
  },
  Vault: {
    flex: 14,
    backgroundColor: colors.Vault,
    width: "100%"
  },
  Joint: {
    flex: 14,
    backgroundColor: colors.Joint,
    width: "100%"
  },
  viewBackBtn: {
    flex: 3,
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
  txtTitle: {
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
  //view:Recent Transaction
  viewMainRecentTran: {
    flex: 25
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
    flex: 3,
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
    alignSelf: "center",
    marginLeft: 2,
    marginRight: 2
  },
  //menuoption
  menuOptions: {
    fontSize: 14,
    marginRight: 60
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
