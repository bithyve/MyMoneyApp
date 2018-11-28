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
import { Container, Body } from "native-base";
import CardSilder, { Pagination } from 'react-native-cards-slider';
import { Button } from "react-native-elements";
import Dialog, { SlideAnimation, DialogTitle, DialogContent, DialogButton } from 'react-native-popup-dialog';
import Toast from 'react-native-simple-toast';

//TODO: Custome Pages
import { colors, images } from "../../../constants/Constants";

export default class OnBoardingScreen extends React.Component {
    constructor(props) {
        super(props);
        StatusBar.setBackgroundColor(colors.appColor, true);
        this.state = {
            code: "",
            visible: false
        };
    }



    //TODO: Funciton
    click_Import() {
        this.setState({ visible: false });
        Toast.show('Thanks', Toast.SHORT);
    }

    render() {
        return (
            <Container style={styles.container}>
                <Body>
                    <View style={styles.viewSlider}>
                        <CardSilder >
                            <View style={styles.slide1}>
                                <Text style={styles.title}>Bithyve</Text>
                                <Image
                                    style={styles.sliderIcon}
                                    resizeMode='contain'
                                    source={images.onBoardingScreen.cardSideBitcon}
                                />
                                <Text style={styles.description}>
                                    The cryptotech specialists providing technology and business expertise in
                                    cryptocurrencies blockchain cryptofinance lightningnetworks sidechains
                                    smartcontracts Ethereum Bitcoin.
                                </Text>
                            </View>
                            <View style={styles.slide2}>
                                <Text style={styles.title}>Zcash</Text>
                                <Image
                                    style={styles.sliderIcon}
                                    resizeMode='contain'
                                    source={images.onBoardingScreen.cardSideBitcon1}
                                />
                                <Text style={styles.description}>
                                    Zcash is a cryptocurrency aimed at using cryptography to provide enhanced
                                  privacy for its users compared to other cryptocurrencies such as Bitcoin. </Text>

                            </View>
                        </CardSilder>
                    </View>
                    <View style={styles.viewContinueBtn}>
                        <Button
                            title="CREATE WALLET"
                            buttonStyle={styles.buttonStype}
                            onPress={() => this.props.navigation.push('BackupPhrase')}
                        />
                        <Button
                            title="IMPORT WALLET"
                            buttonStyle={styles.buttonStype}
                            onPress={() => {
                                this.setState({ visible: true });
                            }}
                        />
                    </View>

                </Body>
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
        flex: 4,
        zIndex: 1
    },
    slide1: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    slide2: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
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
    viewContinueBtn: {
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

