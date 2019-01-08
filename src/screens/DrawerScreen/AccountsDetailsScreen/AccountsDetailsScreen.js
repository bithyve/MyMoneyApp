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
import Icon from "react-native-vector-icons/FontAwesome";

//TODO: Custome Pages
import { colors, images, localDB } from "../../../constants/Constants";
var dbOpration = require("../../../manager/database/DBOpration");
//import styles from './Styles';
import renderIf from "../../../constants/validation/renderIf";
import { DotIndicator } from "react-native-indicators";

//TODO: Wallets
//var walletService = require("../../../bitcoin/services/wallet");
import WalletService from "../../../bitcoin/services/WalletService";

export default class AccountDetailsScreen extends React.Component {
  constructor(props) {
    super(props);
    StatusBar.setBackgroundColor(colors.appColor, true);
    this.state = {
      data: [],
      waletteData: [],
      tranDetails: [],
      refreshing: false,
      isLoading: false,
      isNoTranstion: false
    };
    console.log("2MvwghT7H8Y81v9pSAvTprsNEw5yEqXTDcU");
  }

  //TODO: Page Life Cycle
  componentWillMount() {
    const { navigation } = this.props;
    console.log("first data = ", JSON.stringify(navigation.getParam("data")));
    this.setState({
      data: navigation.getParam("data"),
      waletteData: navigation.getParam("privateKeyJson")[0]
    });
  }

  componentDidMount() {
    this.willFocusSubscription = this.props.navigation.addListener(
      "willFocus",
      () => {
        this.fetchloadData();
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  //TODO: func loadData
  async fetchloadData() {
    this.setState({
      isLoading: true
    });
    const dateTime = Date.now();
    const lastUpdateDate = Math.floor(dateTime / 1000);
    const { navigation } = this.props;
    const bal = await WalletService.getBalance(
      navigation.getParam("data").address
    );
    const resultRecentTras = await WalletService.getTransactions(
      navigation.getParam("data").address
    );
    if (resultRecentTras.transactionDetails.length > 0) {
      const resultRecentTransaction = await dbOpration.insertTblTransation(
        localDB.tableName.tblTransaction,
        resultRecentTras.transactionDetails,
        resultRecentTras.address,
        lastUpdateDate
      );
      if (resultRecentTransaction) {
        this.fetchRecentTransaction(navigation.getParam("data").address);
      }
    } else {
      this.setState({
        isNoTranstion: true
      });
    }
    if (bal) {
      const resultUpdateTblAccount = await dbOpration.updateTableData(
        localDB.tableName.tblAccount,
        bal.final_balance / 1e8,
        navigation.getParam("data").address,
        lastUpdateDate
      );
      if (resultUpdateTblAccount) {
        const resultAccount = await dbOpration.readTablesData(
          localDB.tableName.tblAccount
        );
        this.setState({
          data: resultAccount.temp[0],
          isLoading: false
        });
      }
    }
  }

  //TODO: func fetchRecentTransaction
  async fetchRecentTransaction(address) {
    const resultRecentTras = await dbOpration.readRecentTransactionAddressWise(
      localDB.tableName.tblTransaction,
      address
    );
    this.setState({
      tranDetails: resultRecentTras.temp
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
            source={images.accounts.saving}
            style={styles.backgroundImage}
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
                <Title style={{ color: "#ffffff" }}>options</Title>
              </Right>
            </View>
            <View style={styles.viewBalInfo}>
              <Text style={[styles.txtTile, styles.txtAccountType]}>
                {this.state.data.idAccountType}
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
            <View style={styles.viewTitleRecentTrans}>
              <Text style={styles.txtRecentTran}>Recent Transactions</Text>
              {renderIf(this.state.isLoading)(
                <View style={styles.loading}>
                  <DotIndicator size={5} color={colors.appColor} />
                </View>
              )}
            </View>
            <View style={styles.recentTransListView}>
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
                        <ListItem thumbnail>
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
                              {item.dateCreated}
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
              <Button
                transparent
                onPress={() =>
                  this.props.navigation.push("SentMoneyScreen", {
                    address: this.state.data.address,
                    privateKey: this.state.waletteData.privateKey
                  })
                }
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
    backgroundColor: "#E6A620",
    width: "100%"
  },
  viewBackBtn: {
    flex: 2,
    flexDirection: "row",
    padding: 15,
    marginTop: 10
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
    alignItems:'center'
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
  }
});
