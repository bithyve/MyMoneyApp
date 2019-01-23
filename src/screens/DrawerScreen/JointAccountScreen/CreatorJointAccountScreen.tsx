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
var dbOpration = require("../../../app/manager/database/DBOpration");


//TODO: Custome Pages
import { colors, images, localDB } from "../../../app/constants/Constants";




export default class CreatorJointAccountScreen extends React.Component {
    constructor() {
        super();
        this.state = ({
            PubLink: '',
        });
    }

    componentWillMount() {
        this.sendDetails();
    }

    async sendDetails() {
        const resultWallet = await dbOpration.readTablesData(
            localDB.tableName.tblWallet
        );
        console.log("mnemonics:", resultWallet.temp[0].mnemonic)
        const {
            keyPair
        } = await WalletService.importWallet(resultWallet.temp[0].mnemonic);
        //const { mnemonic, address, keyPair } = await WalletService.createWallet();

        let data = keyPair.publicKey.toString('hex')
        this.setState({
            PubLink: data
        });
        console.log(data)
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
                                numberOfLines={1} style={styles.titleUserName}>Send Joint Account Merge Request</Title>
                        </Body>
                        <Right></Right>
                    </Header>
                    <Content>
                        <Text>
                            This is send Joint Account merge request screen
                        </Text>
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
