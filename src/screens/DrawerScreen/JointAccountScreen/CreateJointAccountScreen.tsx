import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    Alert,
    ImageBackground,
} from 'react-native';
import { Container, Header, Title, Content, Button, Left, Right, Body, Text, Input, Item } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from "react-native-simple-toast";
import WalletService from "../../../bitcoin/services/WalletService";
var dbOpration = require("../../../app/manager/database/DBOpration");
import { AsyncStorage } from "react-native"

//TODO: Custome Pages
import { colors, images, localDB } from "../../../app/constants/Constants";




export default class CreateJointAccountScreen extends React.Component {
    constructor() {
        super();
        this.state = ({
            Name: 'Your Name',
            WalletName: 'Wallet Name',
            JsonString: "empty"
        });
    }
    
    openQRCodeScanner() {
        //  this.props.navigation.push('QrcodeScannerScreen');
        this.props.navigation.navigate("QrcodeScannerScreen", {
            onSelect: this.onSelect
        });
    }

    storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            // Error saving data
        }
	}

    async acknowledgeAndStore(joint:string){
        Joint = JSON.parse(joint)
        const resultWallet = await dbOpration.readTablesData(
            localDB.tableName.tblWallet
        );
        console.log("mnemonics:", resultWallet.temp[0].mnemonic)
        const {
            keyPair
        } = await WalletService.importWallet(resultWallet.temp[0].mnemonic);
        const {
			p2wsh,
			p2sh,
			address
        } = await WalletService.createMultiSig(2,[keyPair.publicKey.toString('hex'),Joint.MPky]);
        if(address == Joint.Add){
            Joint.p2wsh = p2wsh
            Joint.p2sh = p2sh
            Joint.Typ = "IMP"
            Toast.show("Acknowledge merge", Toast.SHORT);
            await this.storeData("Joint",JSON.stringify(Joint))
            this.props.navigation.goBack(null)
        }else{
            Toast.show("Acknowledge merge Error", Toast.SHORT);
        }
    }

    onSelect = data => {
        this.setState({
            JsonString: data.barcode
        });
        Joint = JSON.parse(data.barcode)
        if (Joint.Typ == "CNF") {
            Toast.show("Confirm merge", Toast.SHORT);
            this.props.navigation.navigate("MergeConfirmJointAccountScreen", { JsonString: data.barcode })
        } else if (Joint.Typ == "ACK") {
            this.acknowledgeAndStore(data.barcode)
        } else if (Joint == "IMP") {
            Toast.show("Imported succesfully", Toast.SHORT);
        }
        else { 
            Toast.show("Error qr code", Toast.SHORT);
        }
    };

    render() {
        return (
            <Container>
                <ImageBackground
                    source={images.appBackgound}
                    style={styles.container}
                >

                    <Header transparent>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.goBack(null)}>
                                <Icon name='chevron-left' size={25} color="#ffffff" />
                            </Button>
                        </Left>

                        <Body style={{ flex: 0, alignItems: 'center' }}>
                            <Title adjustsFontSizeToFit={true}
                                numberOfLines={1} style={styles.titleUserName}>Create Joint Account</Title>
                        </Body>
                        <Right></Right>
                    </Header>
                    <Content contentContainerStyle={styles.sample}>
                        <Text>
                            Create Joint Account
                        </Text>
                        <Item rounded>
                            <Input placeholder='Enter Your Name' onChangeText={(text) => this.setState({ Name: text })} />
                        </Item>
                        <Item rounded>
                            <Input placeholder='Enter Wallet Name' onChangeText={(text) => this.setState({ WalletName: text })} />
                        </Item>
                        <Button success style={{ padding: '10%', alignSelf: 'center' }} onPress={() => this.props.navigation.push("CreatorJointAccountScreen", {
                            Name: this.state.Name,
                            WalletName: this.state.WalletName
                        })}><Text> Create </Text></Button>
                        <Text>
                            Or
                        </Text>
                        <Button warning style={{ padding: '10%', alignSelf: 'center' }} onPress={() => this.openQRCodeScanner()}><Text> Merge </Text></Button>
                        <Button warning style={{ padding: '10%', alignSelf: 'center' }} onPress={() => this.props.navigation.push("JointAccountScreen")}><Text> Joint Account </Text></Button>
                    </Content>

                </ImageBackground>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    titleUserName: {
        color: "#ffffff"
    },
    sample: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10%',
        paddingTop: 40
    },
});
