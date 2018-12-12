import React from 'react';
import {
    View,
    Alert,
    ImageBackground,
    Dimensions,
    StatusBar,
    FlatList,
    TouchableHighlight,
    TextInput,
    StyleSheet
} from 'react-native';
import { Container, Header, Title, Content, Button, Left, Right, Body, Text, List, ListItem, Thumbnail } from 'native-base';
import { RkCard } from 'react-native-ui-kitten';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import CardFlip from 'react-native-card-flip';
import Icon from 'react-native-vector-icons/FontAwesome';
import Dialog, { SlideAnimation, DialogTitle, DialogContent, DialogButton } from 'react-native-popup-dialog';
import {
    MKTextField,
    MKColor,
    mdl,
} from 'react-native-material-kit';

//TODO: Custome Pages
import { colors, images } from "../../../constants/Constants";
//import styles from './Styles';
import renderIf from "../../../constants/validation/renderIf";

//TODO: Json Files
import transData from "../../../assets/jsonfiles/paymentScreen/recentTransactions.json";
import cardsData from "../../../assets/jsonfiles/paymentScreen/cardList.json";
import accounts from "../../../assets/jsonfiles/paymentScreen/accountList.json";

const { width, height } = Dimensions.get('window')
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
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

export default class PaymentScreen extends React.Component {

    constructor(props) {
        super(props)
        StatusBar.setBackgroundColor(colors.appColor, true);
        this.state = {
            recentTrans: [],
            cardsList: [],
            accountsList: [],
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
            accountTypeVisible: false,
            isOpen: false,
        }


    }


    componentWillMount() {
        this.getRecentTrans();
    }

    //TODO: Fun GetRecentTrans
    getRecentTrans() {
        this.setState({
            recentTrans: transData.transaction,
            cardsList: cardsData.cards,
            accountsList: accounts.accounts
        });
    }

    //TODO: Funciton
    click_openPopupAccountType() {
        this.setState({ accountTypeVisible: !this.state.accountTypeVisible });
    }

    _renderItem({ item, index }) {
        return (
            <CardFlip style={[styles.rkCard, styles.slideMainCard]} ref={(card) => this['card' + index] = card} >
                <TouchableHighlight onPress={() => this['card' + index].flip({ direction: 'right', duration: 100 })} >
                    <RkCard style={styles.rkCard}>
                        <ImageBackground
                            source={require("../../../assets/images/paymentScreen/bitcoin1.jpg")}
                            style={styles.cardSlideBgImage}
                            borderRadius={10}
                        >
                            <View rkCardHeader >
                                <Text style={[styles.cardText, styles.cardTitle]}>{item.title}</Text>
                            </View>

                            <View rkCardContent>
                                <Text style={[styles.cardText]}> {item.desc}</Text>
                                <Text style={[styles.cardText, styles.cardAmount]}> {item.amount}</Text>
                                <Icon name="ellipsis-v" size={25} color={'#ffffff'} style={{ alignSelf: 'flex-end', marginTop: -25 }} />
                            </View>
                        </ImageBackground>
                    </RkCard>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => this['card' + index].flip({ direction: 'right', duration: 200 })}>
                    <RkCard style={[styles.rkCard, { backgroundColor: item.cardColor, alignItems: 'center', justifyContent: 'center' }]}>
                        <Text style={{ textAlign: 'center', alignContent: 'center' }}> Card Infomation </Text>
                        <Text style={{ textAlign: 'center', alignContent: 'center' }}> {item.title} </Text>
                    </RkCard>
                </TouchableHighlight>
            </CardFlip>
        );
    }





    render() {
        const { slider1ActiveSlide } = this.state;

        return (

            <Container>
                <View style={styles.container}>
                    <ImageBackground
                        source={images.appBackgound}
                        style={styles.container}
                    >
                        <Header transparent>
                            <Left>
                                <Button transparent onPress={() => this.props.navigation.toggleDrawer()}>
                                    <Icon name='bars' size={25} color="#ffffff" />
                                </Button>
                            </Left>
                            <Body>
                                <Title>Anant Tapadia</Title>
                            </Body>
                            <Right>
                                <Button transparent onPress={() => this.props.navigation.push('NotificationScreen')}>
                                    <Icon name='bell' size={15} color="#ffffff" />
                                </Button>
                                <Button transparent onPress={() => this.click_openPopupAccountType()}>
                                    <Icon name='plus' size={25} color="#ffffff" />
                                </Button>
                            </Right>
                        </Header>
                        <View style={styles.sliderView}>
                            <Carousel
                                ref={(c) => { this._carousel = c; }}
                                data={this.state.cardsList}
                                renderItem={this._renderItem}
                                sliderWidth={sliderWidth}
                                itemWidth={itemWidth}
                                onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
                            />
                            <Pagination
                                dotsLength={this.state.cardsList.length}
                                activeDotIndex={slider1ActiveSlide}
                                containerStyle={styles.paginationContainer}
                                dotColor={'rgba(255, 255, 255, 0.92)'}
                                dotStyle={styles.paginationDot}
                                inactiveDotColor={colors.black}
                                inactiveDotOpacity={0.4}
                                inactiveDotScale={0.6}
                                carouselRef={this._slider1Ref}
                                tappableDots={!!this._slider1Ref}
                            />
                        </View>
                        <View style={styles.viewAmountInfo}>
                            <View style={styles.viewAmountSingleLine}>
                                <Text style={styles.txtAmountTitle}>Total Balance:</Text>
                                <Text style={[styles.txtAmountTitle, styles.txtAmount]}>$ 45,094.24</Text>
                            </View>
                            <View style={styles.viewAmountSingleLine}>
                                <Text style={styles.txtAmountTitle}>Available to Spend :</Text>
                                <Text style={[styles.txtAmountTitle, styles.txtAmount]}>$ 44,094</Text>
                            </View>
                            <View style={styles.viewAmountSingleLine}>
                                <Text style={styles.txtAmountTitle}>Total Invested :</Text>
                                <Text style={[styles.txtAmountTitle, styles.txtAmount]}>$ 15,986</Text>
                            </View>
                            <View style={styles.viewAmountSingleLine}>
                                <Text style={styles.txtAmountTitle}>In Vaults :</Text>
                                <Text style={[styles.txtAmountTitle, styles.txtAmount]}>$ 12,950</Text>
                            </View>
                        </View>
                        <View style={styles.viewMainRecentTran}>
                            <View style={styles.viewTitleRecentTrans}>
                                <Text style={styles.txtRecentTran}>Recent Transactions</Text>
                            </View>
                            <View style={styles.recentTransListView}>
                                <FlatList
                                    data={this.state.recentTrans}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) =>
                                        <List>
                                            <ListItem thumbnail>
                                                <Left>
                                                    <Thumbnail source={{ uri: item.logo }} />
                                                </Left>
                                                <Body>
                                                    <Text style={styles.txtTransTitle}>{item.title}</Text>
                                                    <Text note numberOfLines={1}>{item.date}</Text>
                                                </Body>
                                                <Right>
                                                    {renderIf(item.transType == "receive")(<Text style={styles.txtAmoundRec}>{item.amount}</Text>)}
                                                    {renderIf(item.transType != "receive")(<Text style={styles.txtAmoundSent}>- {item.amount}</Text>)}

                                                </Right>
                                            </ListItem>
                                        </List>
                                    }
                                    keyExtractor={item => item.id}
                                />
                            </View>
                        </View>

                        <Dialog
                            width={Dimensions.get('screen').width - 30}
                            visible={this.state.accountTypeVisible}
                            onTouchOutside={() => {
                                this.setState({ accountTypeVisible: false });
                            }}
                            actions={[
                                <DialogButton
                                    text="CONFIGURE"
                                    style={[styles.importPopup, styles.btnPopUPConfigure]}
                                    onPress={() => {
                                        this.click_Import()
                                    }}
                                />,
                            ]}
                            dialogAnimation={new SlideAnimation({
                                slideFrom: 'bottom',
                            })}
                        >
                            <DialogContent >
                                <View style={styles.accountTypePopUP}>
                                    <Text>Enter Account Name</Text>
                                    <MKTextField
                                        tintColor={colors.appColor}
                                        textInputStyle={{ color: colors.black }}
                                        placeholder="Account Name"
                                        style={styles.textfield}
                                        name="accountName"
                                        onChangeText={(val) => this.setState({ email: val })}
                                        customStyle={{ width: Dimensions.get('screen').width - 50 }}
                                    />
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
                                        <Button vertical transparent style={styles.popupBtnAccountInfo}>
                                            <Icon name="lock" size={40} color={colors.appColor} />
                                            <Text style={styles.txtAccountBtnInfo}>Time Lock</Text>
                                        </Button>
                                        <Button vertical transparent style={styles.popupBtnAccountInfo}>
                                            <Icon name="user" size={40} color={colors.appColor} />
                                            <Text style={styles.txtAccountBtnInfo}>Joint/Multi-Sig</Text>
                                        </Button>
                                    </View>
                                </View>

                            </DialogContent>
                        </Dialog>


                    </ImageBackground>

                </View>
            </Container>

        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sliderView: {
        flex: 3,

    },
    slideMainCard: {
        marginTop: 5,
        flex: 9
    },
    rkCard: {
        height: '100%',
        width: '100%',
        alignSelf: 'center',
        borderRadius: 12
    },
    cardSlideBgImage: {
        height: '100%'
    },
    //TODO: CARD
    cardText: {
        color: '#ffffff'
    },
    cardTitle: {
        fontSize: 20,
        marginBottom: '10%'
    },

    cardAmount: {
        fontSize: 16
    },
    paginationContainer: {
        marginBottom: -10
    },
    //Amount Infomation
    viewAmountInfo: {
        flex: 1,
        paddingLeft: 50,

    },
    viewAmountSingleLine: {
        flexDirection: 'row',
    },
    txtAmountTitle: {
        color: "#ffffff"
    },
    txtAmount: {
        fontWeight: 'bold'
    },
    //Recent Transaction
    viewMainRecentTran: {
        flex: 3,

    },
    viewTitleRecentTrans: {
        marginLeft: 20,
    },
    txtRecentTran: {
        fontWeight: 'bold',
        fontSize: 25,
        marginTop: 10
    },
    txtTransTitle: {
        fontWeight: 'bold'
    },
    txtAmoundRec: {
        color: "#228B22",
        fontWeight: 'bold'
    },
    txtAmoundSent: {
        color: "red",
        fontWeight: 'bold'
    },
    recentTransListView: {
        marginBottom: 50
    },
    //Account Type Popup Account
    accountTypePopUP: {
        paddingTop: 10

    },
    viewPopUpAccountType: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    btnPopupAccountAddIcon: {
        height: 60,
        width: 60,
        borderRadius: 30,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.appColor
    },
    //Account list
    viewPopUpAccountList: {
        alignItems: 'center',
    },
    btnGroupAccountTypes: {
        flexDirection: 'column'
    },
    btnAccountTypes: {
        marginVertical: 5,
        borderRadius: 5,
        backgroundColor: '#539F01'
    },
    popupButtonIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginHorizontal: 10,
    },
    popupBtnAccountInfo: {
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    txtAccountBtnInfo: {
        fontSize: 14,
        color: 'gray'
    },
    btnPopUPConfigure: {
        backgroundColor: colors.appColor,
        color: '#ffffff',
        borderRadius: 5,
        marginBottom: 10,
        marginLeft: 5,
        marginRight: 5,
        height: 40
    }
});