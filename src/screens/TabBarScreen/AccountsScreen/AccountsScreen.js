import React from "react";
import {
  View,
  Alert,
  ImageBackground,
  Dimensions,
  StatusBar,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  RefreshControl,
  ScrollView,
  Platform
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
  Thumbnail
} from "native-base";
import { RkCard } from "react-native-ui-kitten";
import { StackActions, NavigationActions } from "react-navigation";
import Carousel, { Pagination } from "react-native-snap-carousel";
import CardFlip from "react-native-card-flip";
import Icon from "react-native-vector-icons/FontAwesome";
import Dialog, {
  SlideAnimation,
  DialogTitle,
  DialogContent,
  DialogButton
} from "react-native-popup-dialog";
import { DotIndicator, SkypeIndicator } from "react-native-indicators";
import DropdownAlert from "react-native-dropdownalert";

import { showMessage, hideMessage } from "react-native-flash-message";

//TODO: Custome Pages
import { colors, images, localDB } from "../../../constants/Constants";
var dbOpration = require("../../../manager/database/DBOpration");
var utils = require("../../../constants/Utils");
let isNetwork;
//import styles from './Styles';
import renderIf from "../../../constants/validation/renderIf";

const { width, height } = Dimensions.get("window");
const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  "window"
);

function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}
const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);
const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;
const SLIDER_1_FIRST_ITEM = 0;

//TODO: Wallets
import WalletService from "../../../bitcoin/services/WalletService";

export default class AccountsScreen extends React.Component {
  constructor(props) {
    super(props);
    StatusBar.setBackgroundColor(colors.appColor, true);
    this.state = {
      isNetwork: true,
      tranDetails: [],
      accountTypeList: [],
      popupAccountTypeList: [],
      walletsData: [],
      userDetails: [],
      fullName: "",
      slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
      accountTypeVisible: false,
      isOpen: false,
      refreshing: false,
      isLoading: false,
      isLoading1: false,
      isNoTranstion: false,
      cardIndexNo: 0
    };
    this.click_openPopupAccountType = this.click_openPopupAccountType.bind(
      this
    );  
    isNetwork = utils.getNetwork();
  }

  //TODO: Page Life Cycle
  componentDidMount() {
    //TODO:User Deails read
    this.getUserDetails();
    this.willFocusSubscription = this.props.navigation.addListener(
      "willFocus",
      () => {
        isNetwork = utils.getNetwork();
        this.connnection_FetchData();
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  //TODO: func getUserDetails
  async getUserDetails() {
    if (!isNetwork) {
      this.dropdown.alertWithType(
        "info",
        "OH!!",
        "Sorry You're Not Connected to the Internet"
      );
    }
    const resultUserDetails = await dbOpration.readTablesData(
      localDB.tableName.tblUser
    );
    this.setState({
      userDetails: resultUserDetails.temp,
      fullName:
        resultUserDetails.temp[0].firstName +
        " " +
        resultUserDetails.temp[0].lastName
    });
  }

  //TODO: func connnection_FetchData
  async connnection_FetchData() {
    this.setState({
      isLoading: true,
      isLoading1: true
    });
    const dateTime = Date.now();
    const lastUpdateDate = Math.floor(dateTime / 1000);
    const resultWallet = await dbOpration.readTablesData(
      localDB.tableName.tblWallet
    );
    const resultPopUpAccountTypes = await dbOpration.readTableAcccountType(
      localDB.tableName.tblAccountType,
      localDB.tableName.tblAccount
    );
    const resultAccount = await dbOpration.readAccountTablesData(
      localDB.tableName.tblAccount
    );
    let recentTransation;
    if (isNetwork) {
      const bal = await WalletService.getBalance(
        resultWallet.temp[this.state.cardIndexNo].address
      );
      if (bal.statusCode == 200) {
        const resultRecentTras = await WalletService.getTransactions(
          resultWallet.temp[this.state.cardIndexNo].address
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
              this.fetchRecentTransaction(resultWallet.temp[0].address);
            }
          } else {
            this.setState({
              isNoTranstion: true,
              tranDetails: []
            });
          }    
          const resultUpdateTblAccount = await dbOpration.updateTableData(
            localDB.tableName.tblAccount,
            bal.final_balance / 1e8,
            resultWallet.temp[0].address,
            lastUpdateDate
          );
          if (resultUpdateTblAccount) {
            this.setState({
              accountTypeList: resultAccount.temp,
              walletsData: resultWallet.temp,
              popupAccountTypeList: resultPopUpAccountTypes.temp,
              isLoading: false,
              isLoading1: false
            });
          }      
        } else {
          this.dropdown.alertWithType(
            "error",
            "OH!!",
            resultRecentTras.errorMessage
          );
        }
      } else {
        this.dropdown.alertWithType("error", "OH!!", bal.errorMessage);
      }
    } else {
      this.fetchRecentTransaction(resultWallet.temp[0].address);
      this.setState({
        accountTypeList: resultAccount.temp,
        walletsData: resultWallet.temp,
        popupAccountTypeList: resultPopUpAccountTypes.temp,
        isLoading: false,
        isLoading1: false
      });
    }
  }

  //TODO: func fetchRecentTransaction
  async fetchRecentTransaction(address) {
    let transation;
    let flag_noTrasation;
    const resultRecentTras = await dbOpration.readRecentTransactionAddressWise(
      localDB.tableName.tblTransaction,
      address
    );
    if (resultRecentTras.temp.length > 0) {
      transation = resultRecentTras.temp;
      flag_noTrasation = false;
    } else {
      transation = [];
      flag_noTrasation = true;
    }
    this.setState({
      tranDetails: transation,
      isNoTranstion: flag_noTrasation
    });
  }

  //TODO: func getSwapCardDetails
  async getSwapCardDetails(index) { 
    isNetwork = utils.getNetwork(); 
    this.setState({
      isLoading1: true,
      cardIndexNo: index
    });
    this.setState({ slider1ActiveSlide: index });
    const dateTime = Date.now();
    const lastUpdateDate = Math.floor(dateTime / 1000);
    const resultAccount = await dbOpration.readAccountTablesData(
      localDB.tableName.tblAccount
    );
    if (resultAccount.temp[index].address != "") {
      console.log('address ='+resultAccount.temp[index].address)
      if (isNetwork) {
        const bal = await WalletService.getBalance(
          resultAccount.temp[index].address
        );
        console.log("bal" + JSON.stringify(bal));   
        if (bal.statusCode == 200) {
          const resultRecentTras = await WalletService.getTransactions(
            resultAccount.temp[index].address
          );
          console.log("recent transation =" + JSON.stringify(resultRecentTras ));
          if (resultRecentTras.statusCode == 200) {
           
          
            if (resultRecentTras.transactionDetails.length > 0) {
              const resultRecentTransaction = await dbOpration.insertTblTransation(
                localDB.tableName.tblTransaction,
                resultRecentTras.transactionDetails,
                resultRecentTras.address,
                lastUpdateDate
              );
              if (resultRecentTransaction) {
                this.fetchRecentTransaction(resultAccount.temp[index].address);
              }
            } else {
              this.setState({
                isNoTranstion: true,
                tranDetails: []
              });
            }
            const resultUpdateTblAccount = await dbOpration.updateTableData(
              localDB.tableName.tblAccount,
              bal.final_balance / 1e8,
              resultAccount.temp[index].address,
              lastUpdateDate
            );
            if (resultUpdateTblAccount) {
              this.setState({
                walletsData: resultAccount.temp,
                isLoading1: false
              });
            }
          } else {
            this.dropdown.alertWithType(
              "error",
              "OH!!",
              resultRecentTras.errorMessage
            );
          }
        } else {
          this.dropdown.alertWithType("error", "OH!!", bal.errorMessage);
        }
      } else {
        this.fetchRecentTransaction(resultAccount.temp[index].address);
        this.setState({
          walletsData: resultAccount.temp,
          isLoading1: false
        });
      }
    } else {
      this.setState({
        isNoTranstion: true,
        tranDetails: [],
        isLoading1: false
      });
    }
  }

  //TODO: func click_openPopupAccountType

  click_openPopupAccountType() {
    if (isNetwork) {
      this.setState({ accountTypeVisible: !this.state.accountTypeVisible });
    } else {
      this.dropdown.alertWithType(
        "info",
        "OH!!",
        "Sorry You're Not Connected to the Internet"
      );
    }
  }

  //TODO: func refresh
  refresh() {
    this.setState({ refreshing: true });
    return new Promise(resolve => {
      setTimeout(() => {
        this.setState({ refreshing: false });
        this.fetchUserDetails();
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

  //TODO: func cardBgColor
  cardBgColor(type) {
    if (type == "Saving") {
      return "style.cardSlideBgImageSaving";
    } else {
      return "style.cardSlideBgImageSecure";
    }
  }
  _renderItem({ item, index }) {
    return (
      <View key={"card" + index}>
        {renderIf(item.accountType == "UnKnown")(
          <TouchableOpacity onPress={this.click_openPopupAccountType}>
            <RkCard style={styles.rkCardUnnown}>
              <Icon name="plus-circle" size={40} color={"#ffffff"} />
              <Text
                style={{ marginTop: 10, fontWeight: "bold", fontSize: 20 }}
                note
              >
                Create a wallet
              </Text>
            </RkCard>
          </TouchableOpacity>
        )}
        {renderIf(item.accountType != "UnKnown")(
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.push("AccountsDetailsScreen", {
                data: item,
                privateKeyJson: this.state.walletsData,
                indexNo: index
              })
            }
          >
            <RkCard style={styles.rkCard}>
              <ImageBackground
                source={images.accounts[item.accountType]}
                style={styles[item.accountType]}
                borderRadius={10}
                imageStyle={{
                  resizeMode: "cover" // works only here!
                }}
              >
                <View rkCardContent style={styles.cardHeader}>
                  <Text style={[styles.cardText, styles.cardTitle]}>
                    {item.accountType}
                  </Text>
                  <Text style={[styles.cardText, styles.cardAmount]}>
                    {item.balance} {item.unit}
                  </Text>
                </View>
                <View style={styles.cardFotter}>
                  <TouchableOpacity onPress={() => alert("working")}>
                    <Icon name="ellipsis-v" size={30} color={colors.white} />
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </RkCard>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  //TODO: func createNewAccount

  createNewAccount(type) {
    if (type == "Secure") {
      this.setState({ accountTypeVisible: !this.state.accountTypeVisible });
      this.props.navigation.push("SecureAccountRouter");
    } else {
      this.setState({ accountTypeVisible: !this.state.accountTypeVisible });
    }
  }

  render() {
    const { slider1ActiveSlide } = this.state;
    return (
      <Container>
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
            source={images.appBackgound}
            style={styles.backgroundImage}
            imageStyle={{
              resizeMode: "cover" // works only here!
            }}
          >
            <Header transparent>
              <Left>
                <Button
                  transparent
                  onPress={() => this.props.navigation.toggleDrawer()}
                >
                  <Icon name="bars" size={25} color="#ffffff" />
                </Button>
              </Left>
              <Body>
                <Title
                  adjustsFontSizeToFit={true}
                  numberOfLines={1}
                  style={styles.titleUserName}
                >
                  {this.state.fullName}
                </Title>
              </Body>
              <Right>
                <Button
                  transparent
                  onPress={() =>
                    this.props.navigation.push("NotificationScreen")
                  }
                >
                  <Icon name="bell" size={15} color="#ffffff" />
                </Button>
                <Button transparent onPress={this.click_openPopupAccountType}>
                  <Icon name="plus" size={25} color="#ffffff" />
                </Button>
              </Right>
            </Header>

            <View style={styles.sliderView}>
              <Carousel
                ref={c => {
                  this._carousel = c;
                }}
                data={this.state.accountTypeList}
                renderItem={this._renderItem.bind(this)}
                sliderWidth={sliderWidth}
                itemWidth={itemWidth}
                onSnapToItem={index => this.getSwapCardDetails(index)}
              />
              {renderIf(!this.state.isLoading)(
                <Pagination
                  dotsLength={this.state.accountTypeList.length}
                  activeDotIndex={slider1ActiveSlide}
                  containerStyle={styles.paginationContainer}
                  dotColor={"rgba(255, 255, 255, 0.92)"}
                  dotStyle={styles.paginationDot}
                  inactiveDotColor={colors.black}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                  carouselRef={this._slider1Ref}
                  tappableDots={!!this._slider1Ref}
                />
              )}

              {renderIf(this.state.isLoading)(
                <View style={styles.loading}>
                  <SkypeIndicator color={colors.white} />
                </View>
              )}
            </View>
            <View style={styles.viewMainRecentTran}>
              <View style={styles.viewTitleRecentTrans}>
                <Text style={styles.txtRecentTran}>Recent Transactions</Text>
                {renderIf(this.state.isLoading1)(
                  <View style={styles.loading}>
                    <DotIndicator size={5} color={colors.appColor} />
                  </View>
                )}
              </View>
              {renderIf(this.state.isNoTranstion)(
                <View style={styles.viewNoTransaction}>
                  <Thumbnail
                    source={require("../../../assets/images/faceIcon/normalFaceIcon.png")}
                  />
                  <Text style={styles.txtNoTransaction} note>
                    No Transactions
                  </Text>
                </View>
              )}
              {renderIf(this.state.tranDetails.length != 0)(
                <View style={styles.recentTransListView}>
                  <FlatList
                    data={this.state.tranDetails}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <List>
                        <ListItem
                          thumbnail
                          onPress={() => this.openRecentTrans(item)}
                        >
                          <Left>
                            <Thumbnail
                              source={require("../../../assets/images/bitcoinLogo.jpg")}
                            />
                          </Left>
                          <Body>
                            <Text style={styles.txtTransTitle}>
                              {item.transactionType}{" "}
                              <Text style={styles.txtConfimation}>
                                {item.confirmationType}{" "}
                              </Text>{" "}
                            </Text>
                            <Text note numberOfLines={1}>
                              {utils.getUnixToDateFormat(item.dateCreated)}
                            </Text>
                          </Body>
                          <Right>
                            {renderIf(item.transactionType == "Sent")(
                              <Text style={styles.txtAmoundSent}>
                                - {item.balance / 1e8}
                              </Text>
                            )}
                            {renderIf(item.transactionType == "Received")(
                              <Text style={styles.txtAmoundRec}>
                                + {item.balance / 1e8}
                              </Text>
                            )}
                          </Right>
                        </ListItem>
                      </List>
                    )}
                    keyExtractor={item => item.hash}
                  />
                </View>
              )}
            </View>
            <Dialog
              width={Dimensions.get("screen").width}
              visible={this.state.accountTypeVisible}
              onTouchOutside={() => {
                this.setState({ accountTypeVisible: false });
              }}
              dialogAnimation={
                new SlideAnimation({
                  slideFrom: "bottom"
                })
              }
              dialogStyle={styles.dialogAccountType}
            >
              <DialogContent containerStyle={styles.dialogContainerAccountType}>
                <Icon
                  name="plus-circle"
                  size={80}
                  style={styles.iconPopUP}
                  color={colors.appColor}
                />
                <View style={styles.accountTypePopUP}>
                  <FlatList
                    data={this.state.popupAccountTypeList}
                    renderItem={({ item }) => (
                      <View style={styles.btnGroupAccountTypes}>
                        <Button
                          full
                          style={styles.btnAccountTypes}
                          onPress={() => this.createNewAccount(item.name)}
                        >
                          <Text>{item.name}</Text>
                        </Button>
                      </View>
                    )}
                  />
                </View>
              </DialogContent>
            </Dialog>
          </ImageBackground>
        </Content>
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
    flex: 1,
    width: "100%"
  },
  titleUserName: {
    color: "#ffffff"
  },
  sliderView: {
    flex: 2,
    paddingTop: Platform.OS === "ios" ? 20 : 0
  },
  slideMainCard: {
    marginTop: 5,
    flex: 9
  },
  rkCard: {
    height: "100%",
    width: "100%",
    alignSelf: "center",
    borderRadius: 12
  },
  rkCardUnnown: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    alignSelf: "center",
    borderRadius: 12,
    backgroundColor: "#787878"
  },
  Savings: {
    flex: 1,
    height: "100%",
    backgroundColor: colors.Saving,
    borderRadius: 10
  },
  Secure: {
    flex: 1,
    height: "100%",
    backgroundColor: colors.Secure,
    borderRadius: 10
  },
  //TODO: swip card:Body or Content
  cardHeader: {
    flex: 5,
    justifyContent: "center",
    flexDirection: "column"
  },
  cardText: {
    color: "#ffffff"
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold"
  },
  cardAmount: {
    fontWeight: "bold",
    fontSize: 30
  },
  paginationContainer: {
    marginBottom: -10
  },
  //TODO: swip card:fotter
  cardFotter: {
    flex: 1,
    alignItems: "flex-end",
    marginRight: 20,
    marginBottom: 10
  },
  //Amount Infomation
  viewAmountInfo: {
    flex: 1,
    paddingLeft: 50
  },
  viewAmountSingleLine: {
    flexDirection: "row"
  },
  txtAmountTitle: {
    color: "#000000"
  },
  txtAmount: {
    fontWeight: "bold"
  },
  //Recent Transaction
  viewMainRecentTran: {
    flex: 3
  },
  viewTitleRecentTrans: {
    marginLeft: 20,
    flexDirection: "row",
    flex: 0.2
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
  //TODO:sty Dialog:Account Type Popup Account
  dialogAccountType: {
    backgroundColor: "transparent"
  },
  dialogContainerAccountType: {
    backgroundColor: colors.white
  },
  accountTypePopUP: {
    marginTop: -40,
    paddingTop: 40,
    borderRadius: 5,
    padding: 20,
    justifyContent: "center",
    backgroundColor: colors.white,
    zIndex: 1
  },
  iconPopUP: {
    alignSelf: "center",
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 1
  },
  viewPopUpAccountType: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10
  },
  btnPopupAccountAddIcon: {
    height: 60,
    width: 60,
    borderRadius: 30,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.appColor
  },
  //Account list
  viewPopUpAccountList: {
    alignItems: "center"
  },
  btnGroupAccountTypes: {
    flexDirection: "column"
  },
  btnAccountTypes: {
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: "#539F01"
  },
  popupButtonIcon: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginHorizontal: 10
  },
  popupBtnAccountInfo: {
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "space-between"
  },
  txtAccountBtnInfo: {
    fontSize: 14,
    color: "gray"
  },
  btnPopUPConfigure: {
    backgroundColor: colors.appColor,
    color: "#ffffff",
    borderRadius: 5,
    marginBottom: 20,
    marginLeft: 5,
    marginRight: 5,
    height: 50
  },
  txtConfimation: {
    fontSize: 10,
    color: "gray"
  }
});
