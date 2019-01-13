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
import Share, { ShareSheet } from 'react-native-share';

import WalletService from "../../../bitcoin/services/WalletService";
var dbOpration = require("../../../manager/database/DBOpration");

//TODO: Custome Pages
import { colors, images , localDB} from "../../../constants/Constants";



export default class JoinJointAccount extends React.Component {
    constructor() {
        super();
        this.state = ({
            AckLink: '',
        });
    }

    componentWillMount(){
        this.sendDetails();
    }

    async sendDetails() {
        const resultWallet = await dbOpration.readTablesData(
            localDB.tableName.tblWallet
          );
        console.log("mnemonics:",resultWallet.temp[0].mnemonic)
        const {
            keyPair
          } = await WalletService.importWallet(resultWallet.temp[0].mnemonic);
        //const { mnemonic, address, keyPair } = await WalletService.createWallet();

        let data = "bithyveapp://Ack/"+keyPair.publicKey.toString('hex')
        this.setState({
            AckLink: data
        });
        console.log(keyPair.publicKey.toString('hex'))
    }


    render() {
        let shareOptions = {
            title: "Acknowledge Bityhve JointAccount Request",
            message: this.state.AckLink,
            url: "",
            subject: "MyMoney" //  for email
        };
        const { id } = this.props.navigation.state.params;
        console.log("after link",id)
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

                        <Body>
                            <Title adjustsFontSizeToFit={true}
                                numberOfLines={1} style={styles.titleUserName}>Join Account</Title>
                        </Body>
                       <Right></Right>
                    </Header>
                    <Content>
                        <Text>
                            Do You want to create a  Joint Account with
              </Text>
              <Text>
                            {id}
              </Text>
              <Button success onPress={() => { Share.open(shareOptions);this.props.navigation.goBack() ;this.props.navigation.push('JointAccountDetails');}}><Text> Create  </Text></Button>  
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
