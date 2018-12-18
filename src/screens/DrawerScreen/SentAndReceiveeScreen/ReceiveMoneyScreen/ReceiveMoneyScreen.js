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
    Clipboard
} from 'react-native';
import { Container, Header, Title, Content, Button, Left, Right, Footer, FooterTab, Body, Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import QRCode from 'react-native-qrcode';
import Toast from 'react-native-simple-toast';

//TODO: Custome Pages
import { colors, images } from "../../../../constants/Constants";
export default class ReceiveMoneyScreen extends React.Component {


    constructor() {
        super();
        this.state = ({
            address: '',
        });
    }



    componentWillMount() {
        const { navigation } = this.props;
        this.setState({
            address: navigation.getParam('address')
        });
    }


    //TODO: Func Copy they code
    click_CopyAddress() {
        Clipboard.setString(this.state.address);
        Toast.show('Address copy!', Toast.SHORT);
    }


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
                            <Title>Receive Money</Title>
                        </Body>
                    </Header>
                    <Content padder>
                        <View style={styles.viewShowQRcode}>
                            <Text style={styles.txtTitle}>My Public Address to Receive My Money</Text>
                            <QRCode
                                value={this.state.address}
                                size={300}
                                bgColor='#000000'
                            />
                            <Text style={styles.txtBarcode}>{this.state.address}</Text>
                            <Button style={styles.btnCopy} full onPress={() => this.click_CopyAddress()} ><Text > COPY WALLET ADDRESS </Text></Button>
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
    viewShowQRcode: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    txtTitle: {
        marginBottom: 20,
        fontSize: 18,
        fontWeight: 'bold'
    },
    txtBarcode: {
        marginTop: 20,
        marginBottom: 20,
        fontSize: 16,  
        textAlign: 'center'
    },
    btnCopy: {
        backgroundColor: colors.appColor
    }

});
