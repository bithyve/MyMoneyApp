import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    StatusBar,
    Dimensions,
    AsyncStorage,
    Text,
    TextInput
} from "react-native";
import { Container, Body, Footer } from "native-base";
import { Button } from "react-native-elements";
import Dialog, { SlideAnimation, DialogTitle, DialogContent, DialogButton } from 'react-native-popup-dialog';
import Toast from 'react-native-simple-toast';
import Spinner from 'react-native-loading-spinner-overlay';
import Carousel, { Pagination } from 'react-native-snap-carousel';


//TODO: Custome Pages
import { colors, images } from "../../../constants/Constants";
import CreateTables from "../../../manager/database/CreateTables";


//TODO: Wallets    
var createWallet = require('../../../bitcoin/services/wallet.js');

//TODO: Json Files
import onBoardingData from "../../../assets/jsonfiles/onBoardingScreen/onBoardingScreen.json";



const { width, height } = Dimensions.get('window')
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
function wp(percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}
const slideWidth = wp(100);
const itemHorizontalMargin = wp(0);
const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;
const SLIDER_1_FIRST_ITEM = 0;


export default class OnBoardingScreen extends React.Component {
    constructor(props) {
        super(props);
        StatusBar.setBackgroundColor(colors.appColor, true);
        this.state = {
            mnemonicValues: [],
            sliderData: [],
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
            visible: false,
            spinner: false,
            imageName: require("../../../assets/images/onBoardingScreen/bitcoin.png")
        };
    }


    //TODO: Page Life Cycle
    componentWillMount() {
        this.getOnBoardingData();
    }

    //TODO: Fun getOnBoardingData
    getOnBoardingData() {
        this.setState({
            sliderData: onBoardingData.onBoarding
        });
    }


    //TODO: Funciton
    click_Import() {
        this.setState({ visible: false });
        Toast.show('Thanks', Toast.SHORT);
    }

    //TODO: Click Started.
    click_started() {
        this.setState({
            spinner: true
        });
        this.getWalletsData();

    }

    async getWalletsData() {
        const { mnemonic, address, keyPair } = await createWallet.createWallet();
        this.setState({
            mnemonicValues: mnemonic.split(" "),
        });
        console.log(this.state.mnemonicValues);
        if (this.state.mnemonicValues.length > 0) {
            this.setState({
                spinner: false
            });
            this.props.navigation.push('BackupPhrase', { numanicValues: this.state.mnemonicValues })
        }
    }



    //TODO: Slider Item View
    _renderItem({ item, index }) {
        var imageName = "../../../assets/images/onBoardingScreen/bitcoin.png";
        return (
            <View style={styles.slidesView}>
                <Text style={styles.title}>{item.title}</Text>
                <Image
                    style={styles.sliderIcon}
                    resizeMode='contain'
                    source={require(imageName)}
                />
                <Text style={styles.description}>
                    {item.desc}
                </Text>
            </View>
        );
    }


    //TODO: func click_signup
    click_SignUP() {
        this.props.navigation.push('UsernameScreen');
    }

    render() {
        const { slider1ActiveSlide } = this.state;
        return (
            <Container style={styles.container}>
                <Body>
                    <View style={styles.viewSlider}>
                        <Carousel
                            ref={(c) => { this._carousel = c; }}
                            data={this.state.sliderData}
                            renderItem={this._renderItem}
                            sliderWidth={sliderWidth}
                            itemWidth={itemWidth}
                            onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
                        />
                        <Pagination
                            dotsLength={this.state.sliderData.length}
                            activeDotIndex={slider1ActiveSlide}
                            containerStyle={styles.paginationContainer}
                            dotColor={colors.appColor}
                            dotStyle={styles.paginationDot}
                            inactiveDotColor={colors.black}
                            inactiveDotOpacity={0.4}
                            inactiveDotScale={0.6}
                            carouselRef={this._slider1Ref}
                            tappableDots={!!this._slider1Ref}
                        />
                    </View>
                    <View style={styles.bottomBtnView}>
                        <Button
                            title="SIGN UP"
                            buttonStyle={styles.buttonStype}
                            onPress={() => this.click_SignUP()}
                        />
                    </View>
                    <Spinner
                        visible={this.state.spinner}
                        textContent={'Loading...'}
                    />
                </Body>
                <CreateTables />
                <Dialog
                    width={Dimensions.get('screen').width - 30}
                    visible={this.state.visible}
                    onTouchOutside={() => {
                        this.setState({ visible: false });
                    }}
                    actions={[
                        <DialogButton
                            text="Import"
                            style={[styles.importPopup, styles.btnPopUP]}
                            onPress={() => {
                                this.click_Import()

                            }}
                        />,
                    ]}
                    dialogTitle={<DialogTitle style={styles.importPopup} title="Import Wallet" />}
                    dialogAnimation={new SlideAnimation({
                        slideFrom: 'bottom',
                    })}
                >
                    <DialogContent>
                        <View style={styles.textAreaContainer} >
                            <TextInput
                                style={styles.textArea}
                                underlineColorAndroid="transparent"
                                placeholder="Mnemonic Key"
                                placeholderTextColor="grey"
                                numberOfLines={10}
                                multiline={true}
                            />
                            <TextInput
                                style={styles.txtPhrase}
                                underlineColorAndroid="transparent"
                                placeholder="Phrase"
                                placeholderTextColor="grey"
                            />
                        </View>
                    </DialogContent>
                </Dialog>
            </Container>  
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff"
    },

    viewSlider: {
        flex: 8,

    },
    slidesView: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 28,
        marginBottom: 20,
        fontWeight: 'bold',
        color: colors.appColor
    },
    description: {
        textAlign: 'center',
        fontSize: 14,
        padding: 10,
        color: colors.appColor
    },
    sliderIcon: {
        height: Dimensions.get("screen").width - 100,
        width: Dimensions.get("screen").width - 100,
        borderRadius: 5
    },
    //TODO: Bottom button
    bottomBtnView: {
        flex: 1
    },
    buttonStype: {
        backgroundColor: colors.appColor,
        width: Dimensions.get("screen").width - 50,
        height: 45,
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 5,
        marginBottom: 10
    },
    //Import Poppu
    importPopup: {
        backgroundColor: colors.appColor
    },
    btnPopUP: {
        color: "#ffffff",
        marginLeft: 10,
        marginRight: 10,
        height: 40,
        marginBottom: 5,
        borderRadius: 10
    },
    //text Area
    textAreaContainer: {
        marginTop: 5,
        margin: -10,
    },
    textArea: {
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 10,
        height: 100,
        marginBottom: 5,
    },
    txtPhrase: {
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 10,
    }
});

