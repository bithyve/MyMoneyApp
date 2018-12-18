
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert,
    AsyncStorage,
    StatusBar,
    Vibration,
    KeyboardAvoidingView,
    Dimensions
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import CodePin from 'react-native-pin-code';
import BusyIndicator from 'react-native-busy-indicator';
import loaderHandler from 'react-native-busy-indicator/LoaderHandler';



import renderIf from "../../constants/validation/renderIf";

//TODO: Custome Pages
import { colors, images, localDB } from "../../constants/Constants";
import SQLite from "react-native-sqlite-storage";
var db = SQLite.openDatabase(localDB.dbName, "1.0", "MyMoney Database", 200000);

//TODO: Wallets    
var createWallet = require('../../bitcoin/services/wallet.js');
const { height, width } = Dimensions.get('window');


export default class PasscodeConfirmScreen extends Component {
    constructor() {
        super();
        this.state = {
            mnemonicValues: [],
            status: 'choice',
            pincode: '',
            success: 'Enter a PinCode!!',
            firstName: '',
            lastName: '',
            email: '',
            mobileNo: '',
            countryName: ''
        };
    }

    //TODO: Page Life Cycle
    componentWillMount() {
        const { navigation } = this.props;
        this.setState({
            firstName: navigation.getParam('firstName'),
            lastName: navigation.getParam('lastName'),
            email: navigation.getParam('email'),
            mobileNo: navigation.getParam('mobileNo'),
            countryName: navigation.getParam('countryName'),

        })
        console.log('first Name= ' + navigation.getParam('firstName'));
    }
    componentWillUnmount() {
        loaderHandler.hideLoader();
    }

    onCheckPincode(code) {
        this.setState({
            status: 'confirm',
            pincode: code,
            success: 'Confirm your PinCode!!'
        });
    }

    onSuccess() {
        loaderHandler.showLoader("Loading");
        setTimeout(() => {
            this.saveData()
        }, 100);

    }

    saveData = async () => {
        const { mnemonic, address, privateKey } = await createWallet.createWallet();
        this.setState({
            mnemonicValues: mnemonic.split(" "),
        });
        if (this.state.mnemonicValues.length > 0) {
            //mnemonic key
            var mnemonicValue = this.state.mnemonicValues;
            var priKeyValue = privateKey;

            //User Details Data
            var date = new Date().getDate();
            var month = new Date().getMonth() + 1;
            var year = new Date().getFullYear();
            var fulldate = date + "-" + month + "-" + year;
            const dateTime = Date.now();
            const fulldate = Math.floor(dateTime / 1000);
            const firstName = this.state.firstName;
            const lastName = this.state.lastName;
            const email = this.state.email;
            const country = this.state.countryName;
            const mobileNumber = this.state.mobileNo;
            db.transaction(function (txn) {
                txn.executeSql(
                    "INSERT INTO " +
                    localDB.tableName.tblUserDetials +
                    " (date,firstName,lastName,email,country,mobileNo) VALUES (:date,:firstName,:lastName,:email,:country,:mobileNo)",
                    [
                        fulldate,
                        firstName,
                        lastName,
                        email,
                        country,
                        mobileNumber,
                    ]
                );
            });
            db.transaction(function (txn) {
                txn.executeSql(
                    "INSERT INTO " +
                    localDB.tableName.tblWallets +
                    " (date,mnemonic,privateKey,address) VALUES (:date,:mnemonic,:privateKey,:address)",
                    [
                        fulldate,
                        mnemonicValue,
                        priKeyValue,
                        address
                    ]
                );
            });
            this.setState({
                success: 'Ok!!'
            });
            const resetAction = StackActions.reset({
                index: 0, // <-- currect active route from actions array
                key: null,
                actions: [
                    NavigationActions.navigate({ routeName: 'TabbarBottom' }),
                ],
            });
            this.props.navigation.dispatch(resetAction);
            try {
                console.log('enter pincode = ' + this.state.pincode);
                AsyncStorage.setItem("@Passcode:key", this.state.pincode);
                AsyncStorage.setItem("@loadingPage:key", "Password");
            } catch (error) {
                // Error saving data
            }
            //loaderHandler.hideLoader();
        }
    }


    render() {
        return (
            <View
                style={styles.container}
            >
                <KeyboardAvoidingView
                    behavior={'position'}
                    contentContainerStyle={styles.avoidingView}
                >
                    {renderIf(this.state.status == "choice")(
                        <CodePin
                            number={4}
                            checkPinCode={(code, callback) => this.onCheckPincode(code)}
                            success={() => this.onSuccess()}
                            containerStyle={styles.containerCodePin}
                            pinStyle={styles.pinStyle}
                            textStyle={{ fontSize: 12 }}
                            text={this.state.success}
                            errorStyle={{ fontSize: 10 }}
                            keyboardType="numeric"
                        />
                    )}
                    {renderIf(this.state.status == "confirm")(
                        <CodePin
                            ref={ref => (this.ref = ref)}
                            code={this.state.pincode}
                            number={4}
                            success={() => this.onSuccess()}
                            containerStyle={styles.containerCodePin}
                            pinStyle={styles.pinStyle}
                            textStyle={{ fontSize: 12 }}
                            text={this.state.success}
                            errorStyle={{ fontSize: 10 }}
                            error={'Incorrect Pincode!!'}
                            keyboardType="numeric"
                        />
                    )}
                </KeyboardAvoidingView>
                <BusyIndicator />
            </View>
        );
    }
}


let styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    blur: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0,
        width: width,
        height: height
    },
    avoidingView: {
        borderRadius: 10,
        height: 150,
        width: width - 30
    },
    containerCodePin: {
        borderRadius: 10
    },
    pinStyle: {
        marginLeft: 5,
        marginRight: 5
    },
    success: {
        fontSize: 20,
        color: 'green',
        textAlign: 'center'
    }
});


