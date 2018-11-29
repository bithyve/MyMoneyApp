import React from 'react';
import {
    View,
    Alert,
    ImageBackground,
    Dimensions,
    StatusBar,
    FlatList,
    TouchableHighlight
} from 'react-native';
import { Container, Header, Title, Content, Button, Left, Right, Body, Text, List, ListItem, Thumbnail } from 'native-base';
import { RkCard } from 'react-native-ui-kitten';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import CardFlip from 'react-native-card-flip';
import Icon from 'react-native-vector-icons/FontAwesome';







//TODO: Custome Pages
import { colors, images } from "../../../constants/Constants";
import styles from './Styles';
import LoadingSpinner from './LoadingSpinner';
import ControlTab from './ControlTab';
import FlatListItem from './FlatListItem';
import FlatListGrid from './FlatListGrid';
import renderIf from "../../../constants/validation/renderIf";

//TODO: Json Files
import transData from "../../../assets/jsonfiles/paymentScreen/recentTransactions.json";
import cardsData from "../../../assets/jsonfiles/paymentScreen/cardList.json";

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
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM
        }
    }


    componentWillMount() {
        this.getRecentTrans();
    }

    //TODO: Fun GetRecentTrans
    getRecentTrans() {
        this.setState({
            recentTrans: transData.transaction,
            cardsList: cardsData.cards
        });
    }

    _renderItem({ item, index }) {
        return (
            <CardFlip style={styles.rkCard} ref={(card) => this['card' + index] = card} >
                <TouchableHighlight style={styles.card} onPress={() => this['card' + index].flip({ direction: 'right', duration: 200 })} >
                    <RkCard style={styles.rkCard}>
                        <ImageBackground
                            source={require("../../../assets/images/paymentScreen/bitcoin1.jpg")}
                            style={styles.container}
                        >
                            <View rkCardHeader >
                                <Text style={[styles.cardText, styles.cardTitle]}>{item.title}</Text>
                            </View>

                            <View rkCardContent>
                                <Text style={[styles.cardText, styles.cardType]}> {item.desc}</Text>
                                <Text style={[styles.cardText, styles.cardAmount]}> {item.amount}</Text>
                            </View>

                        </ImageBackground>
                    </RkCard>
                </TouchableHighlight>
                <TouchableHighlight style={styles.card} onPress={() => this['card' + index].flip({ direction: 'right', duration: 200 })}>
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
                            <Button transparent>
                                <Icon name='bell' size={15} color="#ffffff" />
                            </Button>
                            <Button transparent>
                                <Icon name='plus' size={25} color="#ffffff" />
                            </Button>
                        </Right>
                    </Header>
                    <Content>

                        <View>
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
                            <View>
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
                    </Content>
                </ImageBackground>
            </Container >
        );
    }
}
