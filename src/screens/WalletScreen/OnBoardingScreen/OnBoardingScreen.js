import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    StatusBar,
    Dimensions,
    AsyncStorage,
    Text
} from "react-native";
import { Container, Body } from "native-base";
import CardSilder, { Pagination } from 'react-native-cards-slider';
import { Button } from "react-native-elements";
   

export default class OnBoardingScreen extends React.Component {
    constructor(props) {
        super(props);
        //StatusBar.setHidden(true);
        StatusBar.setBackgroundColor("#F5951D", true);
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
                                    source={require("../../../../assets/images/onBoardingScreen/bitcoin.png")}
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
                                    source={require("../../../../assets/images/onBoardingScreen/bitcoin1.png")}
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
                            onPress={this.storeData}
                        />
                    </View>
                </Body>
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
        color: '#F5951D'
    },
    description: {
        textAlign: 'center',
        fontSize: 14,
        padding: 10,
        color: '#F5951D'
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
        backgroundColor: "#F5951D",
        width: Dimensions.get("screen").width - 50,
        height: 45,
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 5,
        marginBottom: 10
    }
});

