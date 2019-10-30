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
    Dimensions,
    Clipboard,
} from 'react-native';
import { Container, Header, Title, Content, Button, Left, Right, Body, Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import WalletService from "../../../bitcoin/services/WalletService";
var dbOpration = require("../../../app/manager/database/DBOpration");
import { QRCode } from "react-native-custom-qr-codes";
import Toast from "react-native-simple-toast";
import { AsyncStorage } from "react-native"

//TODO: Custome Pages
import { colors, images, localDB } from "../../../app/constants/Constants";




export default class CreatorJointAccountScreen extends React.Component {
    constructor() {
        super();
        this.state = ({
            JsonString: "Test",
        });
    }

    componentWillMount() {
        this.fetchDetails();
    }

    storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            // Error saving data
        }
    }
    

    click_CopyAddress() {
        Clipboard.setString(this.state.JsonString);
        Toast.show("Copied !!", Toast.SHORT);
    }

    async fetchDetails() {
        const resultWallet = await dbOpration.readTablesData(
            localDB.tableName.tblWallet
        );
        console.log("mnemonics:", resultWallet.temp[0].mnemonic)
        const {
            keyPair
        } = await WalletService.importWallet(resultWallet.temp[0].mnemonic);
        //const { mnemonic, address, keyPair } = await WalletService.createWallet();

        let Joint = {
            CN: "usr1",    //creator name
            MN: "usr2",    //merger name
            WN: "Jnt",     //wallet name
            CPky: "cpub", //creator public key
            MPky: "mpub", //merger public key
            p2wsh: "",
            p2sh: "",
            Add: "adrs",  //multisig address
            Typ: ""
          }

        Joint.CN = this.props.navigation.getParam("Name")
        Joint.WN = this.props.navigation.getParam("WalletName")
        Joint.CPky = keyPair.publicKey.toString('hex')
        this.storeData("Joint",JSON.stringify(Joint))
        Joint.Typ = "CNF"
        console.log(Joint.CPky)
        console.log(Joint.CN)
        this.setState({ JsonString: JSON.stringify(Joint) })
        console.log(JSON.stringify(Joint))

    }

    render() {
        return (
            <Container>
                <ImageBackground
                    source={images.appBackgound}
                    style={styles.container}
                >

                    <Header transparent>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name='chevron-left' size={25} color="#ffffff" />
                            </Button>
                        </Left>

                        <Body style={{ flex: 0, alignItems: 'center' }}>
                            <Title adjustsFontSizeToFit={true}
                                numberOfLines={1} style={styles.titleUserName}> Joint Account Merge Request</Title>
                        </Body>
                        <Right></Right>
                    </Header>
                    <Content contentContainerStyle={styles.sample}>
                        <Text>
                            Joint Account merge request 
                        </Text>
                        <View style={styles.viewShowQRcode}>
                            <QRCode
                                logo={images.appIcon}
                                content={this.state.JsonString}
                                size={Dimensions.get("screen").width - 40}
                                codeStyle="square"
                                outerEyeStyle="square"
                                innerEyeStyle="square"
                                //linearGradient={['rgb(255,0,0)','rgb(0,255,255)']}
                                padding={1}
                            />
                            <TouchableOpacity onPress={() => this.click_CopyAddress()}>
                                <Text style={styles.txtBarcode} note>
                                    {this.state.JsonString}
                                </Text>
                            </TouchableOpacity>
                        </View>
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
    txtBarcode: {
        marginTop: 40,
        marginBottom: 20,
        fontSize: 16,
        textAlign: "center"
    },
    viewShowQRcode: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
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
