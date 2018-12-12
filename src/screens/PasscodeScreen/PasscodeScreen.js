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



//TODO: Custome Pages
import { colors, images, localDB } from "../../constants/Constants";
import SQLite from "react-native-sqlite-storage";
var db = SQLite.openDatabase(localDB.dbName, "1.0", "MyMoney Database", 200000);

//TODO: Wallets    
var createWallet = require('../../bitcoin/services/wallet.js');


const { height, width } = Dimensions.get('window');
export default class PasscodeScreen extends Component {
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
            mobileNo: ''
        };
    }



    //TODO: Page Life Cycle
    componentWillMount() {
        this.retrieveData();
    }

    retrieveData = async () => {
        try {
            var passcodeValues = await AsyncStorage.getItem("@Passcode:key");

            this.setState({
                pincode: passcodeValues
            });
        } catch (error) {
            console.log(error);
        }
        console.log('pincode = ' + this.state.pincode);

    }



    onSuccess = () => {
        const resetAction = StackActions.reset({
            index: 0, // <-- currect active route from actions array
            key: null,
            actions: [
                NavigationActions.navigate({ routeName: 'TabbarBottom' }),
            ],
        });
        this.props.navigation.dispatch(resetAction);
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
                    <CodePin
                        ref={ref => (this.ref = ref)}
                        checkPinCode={(code, callback) => callback(code === this.state.pincode)}
                        number={4}
                        success={this.onSuccess}
                        containerStyle={styles.containerCodePin}
                        pinStyle={styles.pinStyle}
                        textStyle={{ fontSize: 12 }}
                        text={this.state.success}
                        errorStyle={{ fontSize: 10 }}
                        error={'Incorrect Pincode!!'}
                        keyboardType="numeric"
                    />
                </KeyboardAvoidingView>
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
});