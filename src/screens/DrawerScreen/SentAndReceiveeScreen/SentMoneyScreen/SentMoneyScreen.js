import React from 'react';
import {
    StyleSheet,
    ImageBackground,
    View,
    TouchableOpacity
} from 'react-native';
import { Container, Header, Title, Content, Button, Left, Right, Body, Text, Input } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
    MKTextField,
    MKColor,
    mdl,
} from 'react-native-material-kit';
import BusyIndicator from 'react-native-busy-indicator';
import loaderHandler from 'react-native-busy-indicator/LoaderHandler';

const required = value => (value ? undefined : 'This is a required field.');
const email = value => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,5}$/i.test(value) ? 'Please provide a valid email address.' : undefined;

//TODO: Custome Pages
import { colors, images } from "../../../../constants/Constants";


import QrcodeScannerScreen from "../QrcodeScannerScreen/QrcodeScannerScreen"

//TODO: Wallets    
var walletService = require('../../../../bitcoin/services/wallet.js');

export default class SentMoneyScreen extends React.Component {

    constructor() {
        super();

        this.state = {
            recipientAddress: '',
            amount: '',
            sentBtnColor: 'gray',
            sentBtnStatus: true,
        }
    }

    
    //TODO: func validation
    validation(val, type) {
        if (type == "address") {
            this.setState({
                recipientAddress: val
            });
        } else {
            this.setState({
                amount: val
            });
        }
        if (this.state.recipientAddress.length > 0 && this.state.amount.length > 0) {
            this.setState({
                sentBtnColor: colors.appColor,
                sentBtnStatus: false
            })
        }
        if (this.state.recipientAddress.length < 0 || this.state.amount.length < 0 || val == '') {
            this.setState({
                sentBtnColor: 'gray',
                sentBtnStatus: true
            })
        }
    }


    //TODO: func click_SentMoney
    async click_SentMoney() {
        loaderHandler.showLoader("Loading");
        var recAddress = this.state.recipientAddress;
        var amountValue = this.state.amount;
        const { navigation } = this.props;
        console.log('address' + navigation.getParam('address'))

        const { success, txid } = await walletService.transfer({
            senderAddress: navigation.getParam('address'),
            recipientAddress: recAddress,
            amount: parseInt(amountValue),
            privateKey: navigation.getParam('privateKey')
        });
        if (success) {
            loaderHandler.hideLoader();
            this.props.navigation.goBack();
        }

    }

    //TODO: func openQRCodeScanner
    openQRCodeScanner() {
        //  this.props.navigation.push('QrcodeScannerScreen');
        this.props.navigation.navigate("QrcodeScannerScreen", { onSelect: this.onSelect });
    }

    onSelect = data => {
        this.setState({
            recipientAddress: data.barcode
        });
    };



    //   onPress = () => {
    //     this.props.navigate("ViewB", { onSelect: this.onSelect });
    //   };



    render() {
        return (
            <Container>
                <ImageBackground
                    source={images.appBackgound}
                    style={styles.container}
                >
                    <Header transparent style={{ backgroundColor: colors.appColor }}>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name='chevron-left' size={25} color="#ffffff" />
                            </Button>
                        </Left>  

                        <Body>
                            <Title>Send Money</Title>
                        </Body>
                    </Header>
                    <Content padder>
                        <View style={styles.selectQRCodeOption}>
                            <Input
                                name={this.state.recipientAddress}
                                value={this.state.recipientAddress}
                                keyboardType={"default"}
                                autoCapitalize='none'
                                placeholder="QRCode"
                                underlineColorAndroid="#000000"
                                onChangeText={(val) => this.validation(val, 'address')}
                                onChange={(val) => this.validation(val, 'address')}
                            />
                            <TouchableOpacity onPress={() => this.openQRCodeScanner()}>
                                <Icon style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }} name="barcode" size={35} color={'#000000'}></Icon>
                            </TouchableOpacity>
                        </View>
                        <Input
                            name={this.state.amount}
                            value={this.state.amount}
                            keyboardType={"default"}
                            placeholder="Amount"
                            autoCapitalize='none'
                            underlineColorAndroid="#000000"
                            onChangeText={(val) => this.validation(val, 'amount')}
                            onChange={(val) => this.validation(val, 'amount')}
                        />

                        <Button style={[styles.btnSent, { backgroundColor: this.state.sentBtnColor }]}
                            full disabled={this.state.sentBtnStatus}
                            onPress={() => this.click_SentMoney()}
                        >
                            <Text > SEND </Text>
                        </Button>
                    </Content>
                </ImageBackground>
                <BusyIndicator />
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    btnSent: {
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.appColor
    },
    //QRCode select option
    selectQRCodeOption:{
        flexDirection:'row'
    }

});
