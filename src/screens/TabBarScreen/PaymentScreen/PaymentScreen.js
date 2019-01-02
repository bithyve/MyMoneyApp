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
  ScrollView
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
import Carousel, { Pagination } from "react-native-snap-carousel";
import CardFlip from "react-native-card-flip";
import Icon from "react-native-vector-icons/FontAwesome";
import Dialog, {
  SlideAnimation,
  DialogTitle,
  DialogContent,
  DialogButton
} from "react-native-popup-dialog";
import BusyIndicator from "react-native-busy-indicator";
import loaderHandler from "react-native-busy-indicator/LoaderHandler";
import PTRView from "react-native-pull-to-refresh";

//TODO: Custome Pages
import { colors, images, localDB } from "../../../constants/Constants";
var dbOpration = require("../../../manager/database/DBOpration");
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

export default class PaymentScreen extends React.Component {
  constructor(props) {
    super(props);
    StatusBar.setBackgroundColor(colors.appColor, true);
    this.state = {
      tranDetails: [],
      accountTypeList: [],
      walletsData: [],
      userDetails: [],
      fullName: "",
      slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
      accountTypeVisible: false,
      isOpen: false
    };
    this.click_openPopupAccountType = this.click_openPopupAccountType.bind(
      this
    );
    this._refresh = this._refresh.bind(this);
  }

  componentDidMount() {
    this.willFocusSubscription = this.props.navigation.addListener(
      "willFocus",
      () => {
        this.fetchUserDetails();
      }
    );
  }

  async fetchUserDetails() {
    loaderHandler.showLoader("Loading");
    const dateTime = Date.now();
    const lastUpdateDate = Math.floor(dateTime / 1000);
    const resultUserDetails = await dbOpration.readTablesData(
      localDB.tableName.tblUser
    );
    const resultWallet = await dbOpration.readTablesData(
      localDB.tableName.tblWallet
    );
    const bal = await WalletService.getBalance(resultWallet.temp[0].address);
    const resultRecentTras = await WalletService.getTransactions(
      resultWallet.temp[0].address
    );
    if (bal) {
      const resultUpdateTblAccount = await dbOpration.updateTableData(
        localDB.tableName.tblAccount,
        bal.final_balance / 1e8,
        resultWallet.temp[0].address,
        lastUpdateDate
      );

      if (resultUpdateTblAccount) {
        const resultAccount = await dbOpration.readTablesData(
          localDB.tableName.tblAccount
        );

        this.setState({
          userDetails: resultUserDetails.temp,
          fullName:
            resultUserDetails.temp[0].firstName +
            " " +
            resultUserDetails.temp[0].lastName,
          accountTypeList: resultAccount.temp,
          walletsData: resultWallet.temp,
          tranDetails: resultRecentTras.transactionDetails
        });
        loaderHandler.hideLoader();
      }
    }
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  //TODO: Funciton
  click_openPopupAccountType() {
    this.setState({ accountTypeVisible: !this.state.accountTypeVisible });
  }

  //TODO: Funciton
  click_openPopupAccountType() {
    console.log("hi");
    this.setState({ accountTypeVisible: !this.state.accountTypeVisible });
  }
  
  //TODO: Ref
  _refresh() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.fetchUserDetails();
        resolve();
      }, 2000);
    });
  }

  _renderItem({ item, index }) {
    return (
      <View key={"card" + index}>
        {renderIf(item.idAccountType == "UnKnown")(
          <TouchableHighlight onPress={this.click_openPopupAccountType}>
            <RkCard style={styles.rkCardUnnown}>
              <Icon name="plus-circle" size={40} color={"#ffffff"} />
              <Text
                style={{ marginTop: 10, fontWeight: "bold", fontSize: 20 }}
                note
              >
                Create a wallet
              </Text>
            </RkCard>
          </TouchableHighlight>
        )}
        {renderIf(item.idAccountType != "receive")(
          <TouchableHighlight
            onPress={() =>
              this.props.navigation.push("AccountsDetailsScreen", {
                data: item,
                privateKeyJson: this.state.walletsData
              })
            }
          >
            <RkCard style={styles.rkCard}>
              <ImageBackground
                source={images.accounts.saving}
                style={styles.cardSlideBgImage}
                borderRadius={10}
                imageStyle={{
                  resizeMode: "cover" // works only here!
                }}
              >
                <View rkCardContent style={styles.cardHeader}>
                  <Text style={[styles.cardText, styles.cardTitle]}>
                    {item.idAccountType}
                  </Text>
                  <Text style={[styles.cardText, styles.cardAmount]}>
                    {item.balance} {item.unit}
                  </Text>
                </View>
              </ImageBackground>
            </RkCard>
          </TouchableHighlight>
        )}
      </View>
    );
  }

  checkConfirmation(val) {
    let label;
    if (val == 0) {
      label = "UNCONFIRMED";
    } else if (val > 0 && val < 6) {
      label = "CONFIRMED";
    } else {
      label = "SUPER CONFIRMED";
    }

    return label;
  }

  //TODO: Ref

  _refresh() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.fetchUserDetails();
        resolve();
      }, 2000);
    });
  }

  render() {
    const { slider1ActiveSlide } = this.state;
    return (
      <Container>
        <Content contentContainerStyle={styles.container} scrollEnabled={false}>
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
            <PTRView onRefresh={this._refresh.bind(this)}>
              <View style={styles.sliderView}>
                <Carousel
                  ref={c => {
                    this._carousel = c;
                  }}
                  data={this.state.accountTypeList}
                  renderItem={this._renderItem.bind(this)}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  onSnapToItem={index =>
                    this.setState({ slider1ActiveSlide: index })
                  }
                />
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
              </View>
              <View style={styles.viewMainRecentTran}>
                <View style={styles.viewTitleRecentTrans}>
                  <Text style={styles.txtRecentTran}>Recent Transactions</Text>
                </View>
                <View style={styles.recentTransListView}>
                  <FlatList
                    data={this.state.tranDetails}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <List>
                        <ListItem thumbnail>
                          <Left>
                            <Thumbnail
                              source={require("../../../assets/images/bitcoinLogo.jpg")}
                            />
                          </Left>
                          <Body>
                            {renderIf(item.sent == true)(
                              <Text style={styles.txtTransTitle}>
                                Sent{" "}
                                <Text style={styles.txtConfimation}>
                                  {this.checkConfirmation(item.confirmations)}{" "}
                                </Text>{" "}
                              </Text>
                            )}
                            {renderIf(item.sent != true)(
                              <Text style={styles.txtTransTitle}>
                                Recieved{" "}
                                <Text style={styles.txtConfimation}>
                                  {this.checkConfirmation(item.confirmations)}{" "}
                                </Text>{" "}
                              </Text>
                            )}

                            <Text note numberOfLines={1}>
                              {item.received}
                            </Text>
                          </Body>
                          <Right>
                            {renderIf(item.sent == true)(
                              <Text style={styles.txtAmoundSent}>
                                - {item.totalSpent / 1e8}
                              </Text>
                            )}
                            {renderIf(item.sent != true)(
                              <Text style={styles.txtAmoundRec}>
                                + {item.totalRecieved / 1e8}
                              </Text>
                            )}
                          </Right>
                        </ListItem>
                      </List>
                    )}
                    keyExtractor={item => item.hash}
                  />
                </View>
              </View>
              <Dialog
                width={Dimensions.get("screen").width - 30}
                visible={this.state.accountTypeVisible}
                onTouchOutside={() => {
                  this.setState({ accountTypeVisible: false });
                }}
                actions={[
                  <DialogButton
                    text="CONFIGURE"
                    style={[styles.importPopup, styles.btnPopUPConfigure]}
                    onPress={() => {
                      this.click_Import();
                    }}
                  />
                ]}
                dialogAnimation={
                  new SlideAnimation({
                    slideFrom: "bottom"
                  })
                }
              >
                <DialogContent>
                  <View style={styles.accountTypePopUP}>
                    <View style={styles.btnGroupAccountTypes}>
                      <Button full style={styles.btnAccountTypes}>
                        <Text>Saving Account</Text>
                      </Button>
                      <Button full style={styles.btnAccountTypes}>
                        <Text>Investment</Text>
                      </Button>
                      <Button full style={styles.btnAccountTypes}>
                        <Text>Agrement</Text>
                      </Button>
                    </View>
                    <View style={styles.popupButtonIcon}>
                      <Button
                        vertical
                        transparent
                        style={styles.popupBtnAccountInfo}
                      >
                        <Icon name="lock" size={40} color={colors.appColor} />
                        <Text style={styles.txtAccountBtnInfo}>Time Lock</Text>
                      </Button>
                      <Button
                        vertical
                        transparent
                        style={styles.popupBtnAccountInfo}
                      >
                        <Icon name="user" size={40} color={colors.appColor} />
                        <Text style={styles.txtAccountBtnInfo}>
                          Joint/Multi-Sig
                        </Text>
                      </Button>
                    </View>
                  </View>
                </DialogContent>
              </Dialog>
            </PTRView>
          </ImageBackground>
        </Content>
        <BusyIndicator />
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
    paddingTop: 20
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
    height: "74%",
    width: "100%",
    alignSelf: "center",
    borderRadius: 12,
    backgroundColor: "#787878"
  },
  cardSlideBgImage: {
    flex: 1,
    height: "100%",
    backgroundColor: "#E6A620",
    borderRadius: 10
  },
  //TODO: CARD
  cardHeader: {
    flex: 1,
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
    marginLeft: 20
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
    flex: 1,
    marginTop: 10
  },
  //Account Type Popup Account
  accountTypePopUP: {
    paddingTop: 10
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
