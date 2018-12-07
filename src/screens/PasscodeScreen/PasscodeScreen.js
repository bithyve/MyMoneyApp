
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert,
    AsyncStorage,
    StatusBar
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import { colors } from "../../constants/Constants";
import PINCode from '@haskkor/react-native-pincode'
import Keychain from "react-native-keychain";


export default class PasscodeScreen extends Component {
    constructor(props) {
        super(props);
        StatusBar.setBackgroundColor(colors.appColor, true);
        this.state = {

        }
    }

    //TODO: Page life cycle

    componentWillMount() {

    }

    render() {

        return (
            <PINCode
                status={'choose'}
                passwordLength={4}
                titleChoose="Enter a PIN Code"
                titleConfirm="Confirm your PIN Code"
                touchIDDisabled={false}
                colorPassword={colors.appColor}
                numbersButtonOverlayColor={colors.appColor}
                styleLockScreenText={colors.appColor}
                styleLockScreenColorIcon={colors.appColor}
                subtitleError="Please try again!!"   
            />
        );
    }
}


const styles = StyleSheet.create({
    spinnerTextStyle: {
        color: '#000000'
    }
});