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
    Dimensions
} from 'react-native';
import { Container, Header, Title, Content, Button, Left, Right, Body, Text, Card, CardItem } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
       

//TODO: Custome Pages
import { colors, images } from "../../../constants/Constants";



export default class SentAndReceiveeScreen extends React.Component {
    render() {
        return (
            <Container>
                <ImageBackground
                    source={images.appBackgound}
                    style={styles.container}
                >
                    <Header transparent style={{backgroundColor:colors.appColor}}>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name='chevron-left' size={25} color="#ffffff" />
                            </Button>
                        </Left>
                        <Body>   
                            <Title>My Money</Title>
                        </Body>  
                    </Header>  
                    <Content padder>   
                        <Card style={styles.cardSentandRec}>
                            <CardItem>
                                <View style={styles.viewAppIcon}>
                                    <Image
                                        style={styles.imgappIcon}
                                        resizeMode='contain'
                                        source={images.appIcon}
                                    />
                                    <View style={styles.viewInline}>
                                        <Text style={styles.txtBal}>0.00 Test</Text>
                                        <Text style={styles.txtExcRate}>  ($0.00)</Text>
                                    </View>
                                </View>
                            </CardItem>
                            <CardItem footer>
                                <View style={styles.viewButtonSaveRec}></View>   
                                <Button style={styles.btnSentAndRec}  onPress={() => this.props.navigation.push('SentMoneyScreen')} ><Text style={styles.txtButtonTitle}> SEND </Text></Button>
                                <Button style={styles.btnSentAndRec}  onPress={() => this.props.navigation.push('ReceiveMoneyScreen')} ><Text style={styles.txtButtonTitle}> RECEIVE </Text></Button>
                            </CardItem>
                        </Card>
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
   
    viewAppIcon: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    imgappIcon: {
        height: 70,
        width: 70,
        borderRadius: 35,
        marginBottom: 10,
    },
    viewInline: {
        flexDirection: 'row',
       alignItems:'center',
       marginHorizontal:10,
    },
    txtBal: {
        fontSize: 18
    },
    txtExcRate: {
        fontSize: 14,
        color: 'red'
    },
    //Buttons
    viewButtonSaveRec: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnSentAndRec: {
        flex: 1,
        marginHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.appColor
    },
    txtButtonTitle: {


    }
});
