import React from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    TouchableOpacity,
    Platform,
    Linking,
    AsyncStorage
} from 'react-native';
import { Container, Content, Button, Form, Item, Label, Input, Right, Body, Text, Footer, Picker } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-simple-toast';
import DeviceInfo from 'react-native-device-info'
import CountryPicker, {
    getAllCountries
} from 'react-native-country-picker-modal'
import SafariView from "react-native-safari-view";
import RSAKey from 'react-native-rsa';
import { StackActions, NavigationActions } from 'react-navigation';




//TODO: Custome Pages
import { colors, images, localDB } from "../../../constants/Constants";
import SQLite from "react-native-sqlite-storage";
var db = SQLite.openDatabase(localDB.dbName, "1.0", "MyMoney Database", 200000);



import closeImgLight from "../../../assets/images/mobileNoDetailsScreen/countryPickerClose.png";
const INDIA = ['IN']
const DARK_COLOR = "#18171C";
const PLACEHOLDER_COLOR = "rgba(255,255,255,0.2)";
const LIGHT_COLOR = "#FFF";
export default class UserMobileNoScreen extends React.Component {
    constructor(props) {
        super(props);
        let userLocaleCountryCode = DeviceInfo.getDeviceCountry()
        console.log(userLocaleCountryCode);
        const userCountryData = getAllCountries()
            .filter(country => INDIA.includes(country.cca2))
            .filter(country => country.cca2 === userLocaleCountryCode)
            .pop()
        let callingCode = null
        let cca2 = userLocaleCountryCode
        if (!cca2 || !userCountryData) {
            cca2 = 'IN'
            callingCode = '91'
        } else {
            callingCode = userCountryData.callingCode
        }
        this.state = ({
            firstName: '',
            lastName: '',
            email: '',
            mobileNo: '',
            continueBtnColor: 'gray',
            continueBtnStatus: true,
            cca2,
            callingCode,
            countryName: 'India',
            mobileNotes: "We'll sent a text message to verify your phone.",

        })
    }


    //TODO: Page Life Cycle
    componentWillMount() {
        const { navigation } = this.props;
        this.setState({
            firstName: navigation.getParam('firstName'),
            lastName: navigation.getParam('lastName'),
            email: navigation.getParam('email'),
        })

    }


    //TODO: func validationText
    validationText(text, type) {
        if (/^\d{10}$/.test(text)) {
            this.setState({
                mobileNo: text,
                continueBtnColor: colors.appColor,
                continueBtnStatus: false,
            });
        }
        else {
            this.setState({
                continueBtnColor: 'gray',
                continueBtnStatus: true,
            });
        }
    }


    //TODO: func tearmanduse
    click_tearmsOfUse() {

        if (Platform.OS == 'ios') {
            SafariView.isAvailable()
                .then(SafariView.show({
                    url: "https://bithyve.com/",
                    readerMode: true,
                    tintColor: colors.appColor,
                    barTintColor: "#fff"

                }))
                .catch(error => {
                    // Fallback WebView code for iOS 8 and earlier
                });
        } else {
            Linking.openURL('https://bithyve.com/')
        }

    }


    //TODO: func click_Continue

    click_Continue() {
        // var date = new Date().getDate();
        // var month = new Date().getMonth() + 1;
        // var year = new Date().getFullYear();
        // var fulldate = date + "-" + month + "-" + year;
        // const dateTime = Date.now();
        // const fulldate = Math.floor(dateTime / 1000);
        // const firstName = this.state.firstName;
        // const lastName = this.state.lastName;
        // const email = this.state.email;
        // const country = this.state.countryName;
        // const mobileNumber = '+' + this.state.callingCode + this.state.mobileNo;
        // db.transaction(function (txn) {
        //     txn.executeSql(
        //         "INSERT INTO " +
        //         localDB.tableName.tblUserDetials +
        //         " (date,firstName,lastName,email,country,mobileNo) VALUES (:date,:firstName,:lastName,:email,:country,:mobileNo)",
        //         [
        //             fulldate,
        //             firstName,
        //             lastName,
        //             email,
        //             country,
        //             mobileNumber,
        //         ]
        //     );
        // });


        // const bits = 1024;
        // const exponent = '10001'; // must be a string. This is hex string. decimal = 65537
        // var rsa = new RSAKey();
        // rsa.generate(bits, exponent);
        // var publicKey = rsa.getPublicString(); // return json encoded string
        // var privateKey = rsa.getPrivateString(); // return json encoded string  
        // var publicJson = JSON.parse(publicKey);
        // var privateJson = JSON.parse(privateKey);
        // AsyncStorage.setItem("@publicKey:key", publicJson["n"]);
        // AsyncStorage.setItem("@privateKey:key", privateJson["n"]);

        const resetAction = StackActions.reset({
            index: 0, // <-- currect active route from actions array
            key: null,
            actions: [
                NavigationActions.navigate({ routeName: 'PasscodeScreen' }),
            ],
        });
        this.props.navigation.dispatch(resetAction);

    }

    render() {
        return (
            <Container >
                <Content contentContainerStyle={styles.container}>
                    <View style={styles.whatnameTitle}>
                        <Text style={styles.txtTitle}>What is your mobile phone number?</Text>
                    </View>
                    <View style={styles.inputFormView} >
                        <View style={styles.countryView}>
                            <CountryPicker
                                filterPlaceholderTextColor={PLACEHOLDER_COLOR}
                                closeButtonImage={closeImgLight}
                                styles={[darkTheme]}
                                filterable={true}
                                onChange={value => {
                                    this.setState({ countryName: value.name, cca2: value.cca2, callingCode: value.callingCode })
                                }}
                                cca2={this.state.cca2}
                                translation='eng'
                            />
                            <Text style={styles.txtcountryName}>
                                {this.state.countryName}
                            </Text>
                        </View>
                        <View style={styles.callingDetailsView}>
                            <Text style={{ alignSelf: 'center' }}>+ {this.state.callingCode}</Text>
                            <Input
                                name={this.state.mobileNo}
                                keyboardType={"phone-pad"}
                                underlineColorAndroid={'gray'}
                                onChangeText={(text) => this.validationText(text, 'mobileNo')}
                            />
                        </View>
                        <Text style={{ alignSelf: 'center', textAlign: 'center', marginLeft: 60, marginRight: 45, marginTop: 5 }} note>{this.state.note}</Text>
                        <Text style={{ alignSelf: 'center', textAlign: 'center', marginLeft: 50, marginRight: 50, marginTop: -30 }} note>{this.state.mobileNotes}</Text>

                        <View style={styles.txtTermsOfUseView}>
                            <Text note style={styles.txtTermsOfUse}>By signing up, you have read and accepted MyMoney </Text>
                            <TouchableOpacity onPress={() => this.click_tearmsOfUse()}><Text style={styles.txtTermsOfUse1} >Terms of Use</Text></TouchableOpacity>
                        </View>
                    </View>
                </Content>
                <Footer style={{ backgroundColor: this.state.continueBtnColor }}>
                    <Button full disabled={this.state.continueBtnStatus} style={styles.btnContinue} transparent onPress={() => this.click_Continue()}>
                        <Text style={{ color: '#ffffff' }}>Continue</Text>
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
    whatnameTitle: {
        flex: 0.4,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    txtTitle: {
        color: colors.appColor,
        fontSize: 20

    },
    inputFormView: {
        flex: 4,
        marginTop: 20,

    },
    countryView: {
        paddingBottom: 5,
        textAlign: 'center',
        flexDirection: 'row',
        marginLeft: 20,
        marginRight: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',

    },

    txtcountryName: {
        marginLeft: 10
    },

    //Mobile no Style
    callingDetailsView: {
        textAlign: 'center',
        flexDirection: 'row',
        marginLeft: 20,
        marginRight: 20
    },

    footerView: {
        flex: 0.5,
    },
    btnContinue: {
        alignSelf: 'center'
    },
    //Terms and use 
    txtTermsOfUseView: {
        marginLeft: 20,
        marginRight: 20,
    },
    txtTermsOfUse: {
        marginTop: 60,
        textAlign: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        fontSize: 12
    },
    txtTermsOfUse1: {
        color: 'blue',
        fontSize: 12,
        textAlign: 'center',
    }

});


const darkTheme = StyleSheet.create({
    modalContainer: {
        backgroundColor: DARK_COLOR,

    },
    contentContainer: {
        backgroundColor: DARK_COLOR,

    },
    header: {
        backgroundColor: DARK_COLOR,

    },
    itemCountryName: {
        borderBottomWidth: 0
    },
    countryName: {
        color: LIGHT_COLOR
    },
    letterText: {
        color: LIGHT_COLOR
    },
    input: {
        color: LIGHT_COLOR,
        borderBottomWidth: 1,
        borderColor: LIGHT_COLOR
    },

});