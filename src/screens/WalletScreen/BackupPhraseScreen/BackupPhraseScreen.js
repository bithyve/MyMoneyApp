import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Dimensions,
    View,
    Alert,
    StatusBar,
    TouchableOpacity,
    Clipboard,
    ToastAndroid,
    AlertIOS
} from 'react-native';
import { Container, Header, Title, Content, Button, Left, Right, Body, Text, Footer } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import Share, { ShareSheet } from 'react-native-share';


//TODO: Custome Pages
import { colors, images } from "../../../constants/Constants";


export default class BackupPhraseScreen extends React.Component {
    constructor(props) {
        super(props);
        StatusBar.setHidden(false);
        this.state = ({
            numanicValues: ['impose', 'case', 'tree', 'stay', 'cotton', 'album', 'rose', 'effort', 'transfer', 'smile', 'fold', 'tone'],
            visible: false
        })
    }

    onCancel() {
        this.setState({ visible: false });
    }
    onOpen() {
        this.setState({ visible: true });
    }

    render() {
        const textSecurityKey = this.state.numanicValues.map((type) => <Text style={styles.secrityChar}> {type} </Text>)
        var numanicKey = this.state.numanicValues.toString();
        let shareOptions = {
            title: "Numeric key",
            message: numanicKey,
            url: "\nhttps://bithyve.com/",
            subject: "MyMoney" //  for email
        };


        return (
            <Container style={styles.container}>
                <Header style={{ backgroundColor: '#F5951D' }} androidStatusBarColor="#F5951D">
                    <Body>
                        <Title>Backup Phrase</Title>
                    </Body>
                </Header>
                <Content>
                    <View style={styles.viewImageAndTitle}>
                        <Image
                            style={styles.backupImg}
                            resizeMode='contain'
                            source={images.backupPhraseScreen.backupPhraseLogo}
                        />
                        <Text style={styles.desc}>These 12 words are they only way to restore your MyMoney App.</Text>
                        <Text style={styles.desc}>Save them somewhere safe and secret.</Text>
                    </View>
                    <View style={styles.viewNumanicValue}>
                        {textSecurityKey}

                    </View>
                    <View>
                        <Button transparent style={styles.btnCopy} onPress={() => {
                            Share.open(shareOptions);
                        }}>
                            <Text style={{
                                fontWeight: 'bold', fontSize: 16,
                                color: '#F5951D'
                            }}>Copy</Text>
                        </Button>
                    </View>
                </Content>
                <Footer style={styles.footer}>
                    <Button style={styles.btnNext} onPress={() => this.props.navigation.push('VerifyBackupPhrase',
                        {
                            numanicValues: this.state.numanicValues
                        })}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>NEXT</Text>
                    </Button>
                </Footer>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    viewImageAndTitle: {
        flex: 2,
        alignItems: 'center',
        marginTop: 80,
    },
    backupImg: {
        marginBottom: 20
    },
    desc: {
        textAlign: 'center',
        color: 'gray',
    },
    //Numanic Values show
    viewNumanicValue: {
        backgroundColor: '#ECF0F4',
        height: 100,
        marginTop: 30,
        flexDirection: 'row',
        flexWrap: "wrap",
        padding: 10,
    },
    secrityChar: {
        fontSize: 20,
        padding: 1
    },
    btnCopy: {
        alignSelf: 'center',
        fontWeight: 'bold',
        marginTop: 10
    },
    //next button style
    btnNext: {
        backgroundColor: "#F5951D",
        width: Dimensions.get("screen").width - 50,
        height: 40,
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 5,
        marginBottom: 10,
        justifyContent: 'center'
    },
    //Fotter
    footer: {
        backgroundColor: "transparent",
    }
});
