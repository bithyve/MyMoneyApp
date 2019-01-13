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
import WalletService from "../../../bitcoin/services/WalletService";
var dbOpration = require("../../../manager/database/DBOpration");
import Share, { ShareSheet } from 'react-native-share';


//TODO: Custome Pages
import { colors, images, localDB } from "../../../constants/Constants";



export default class CreateJointAccountScreen extends React.Component {

    constructor() {
        super();
        this.state = ({
            PubLink: '',
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

        let data = "bithyveapp://Joint/"+keyPair.publicKey.toString('hex')
        this.setState({
            PubLink: data
        });
        console.log(keyPair.publicKey.toString('hex'))
    }

    render() {
        let shareOptions = {
            title: "Create Bithyve JointAccount Request",
            message: this.state.PubLink,
            url: "",
            subject: "MyMoney" //  for email
        };
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
                                numberOfLines={1} style={styles.titleUserName}>Create Joint Account</Title>
                        </Body>
                       <Right></Right>
                    </Header>
                    <Content>
                        <Text>
                            This is Create Joint Account
                        </Text>
                        <Button success onPress={() => { Share.open(shareOptions); this.props.navigation.goBack();}}><Text> Create  </Text></Button>              
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

