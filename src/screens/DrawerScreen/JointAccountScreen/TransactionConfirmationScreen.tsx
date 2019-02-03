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
import { Container, Header, Title, Content, Button, Left, Right, Body, Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
var dbOpration = require("../../../app/manager/database/DBOpration");
import WalletService from "../../../bitcoin/services/WalletService";
import { AsyncStorage } from "react-native"

//TODO: Custome Pages
import { colors, images, localDB } from "../../../app/constants/Constants";




export default class TransactionConfirmationScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            recipientAddress: "No Address",
            amount: "0",
        };
    }

    componentWillMount() {
        let trans = this.props.navigation.getParam('json')
        var transaction = JSON.parse(trans)
        this.setState({ recipientAddress: transaction.recipient })
        this.setState({ amount: transaction.amount })

    }

    confirmSendMoney = async () => {

        let trans = this.props.navigation.getParam('json')
        var transaction = JSON.parse(trans)

        try {
            const value = await AsyncStorage.getItem("Joint");
            if (value !== null) {
              console.log("Initiated")
              const resultWallet = await dbOpration.readTablesData(
                localDB.tableName.tblWallet
              );
              console.log("Database read")
      
              var { privateKey } = await WalletService.importWallet(resultWallet.temp[0].mnemonic);
              console.log("wallet imported", privateKey)
              let Joint = JSON.parse(value)
              console.log("json stringified")
              var recAddress = this.state.recipientAddress;
              var amountValue = this.state.amount;
              console.log(Joint.Add, recAddress, amountValue, privateKey, Joint.p2sh, Joint.p2wsh)
              const { reHex} = await WalletService.completeMultisigTransaction(transaction.hex,transaction.inputs,privateKey, Joint.p2sh, Joint.p2wsh)
              console.log("Complete Transaction hex", reHex)

            }
          } catch (error) {
            Toast.show(JSON.stringify(error), Toast.SHORT);
            // Error retrieving data
          }
        }
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
                                numberOfLines={1} style={styles.titleUserName}>Confirm Transaction</Title>
                        </Body>
                        <Right></Right>
                    </Header>
                    <Content>
                        <Text>
                            Do you want to send {this.state.amount} to {this.state.recipientAddress} ?
                        </Text>
                        <Button
                            onPress={() => { this.confirmSendMoney() }}>
                            <Text> CONFIRM </Text>
                        </Button>
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
});
