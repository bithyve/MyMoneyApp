
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

import PasswordGesture from 'react-native-gesture-password';
var Password1 = '4253';
export default class PasswordGestureScreen extends Component {
    constructor(props) {
        super(props);
        StatusBar.setBackgroundColor(colors.appColor, true);
        this.state = {
            message: 'Please input your password.',
            status: 'normal',
            spinner: true,
            pageName: 'OnBoardingNavigator',
            _isMounted: false
        }
    }

    //TODO: Page life cycle

    componentWillMount() {
        console.log('call pass class');
        this.retrieveData();
        this.setState({
            _isMounted: true
        });
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                spinner: !this.state.spinner
            });
        }, 100);
    }

    componentWillUnmount() {
        this.setState({
            _isMounted: false
        });
    }

    retrieveData = async () => {
        try {
            var signed = await AsyncStorage.getItem("@signedPage:key");
            console.log('pass =' + signed);
            if (signed == "Home") {
                this.setState({
                    pageName: 'TabbarBottom'
                });
            }
            else {
                this.setState({
                    pageName: 'OnBoardingNavigator'
                });
            }
        } catch (error) {
            console.log(error);
        }

    }

    onEnd(password) {
        if (password == Password1) {
            this.setState({
                status: 'right',
                message: 'Password is right, success.'
            });
            // this.props.navigation.push('TabbarBottom');

            console.log('password page pagename=' + this.state.pageName);
            const resetAction = StackActions.reset({
                index: 0, // <-- currect active route from actions array
                key: null,
                actions: [
                    NavigationActions.navigate({ routeName: this.state.pageName }),
                ],
            });
            this.props.navigation.dispatch(resetAction);

        } else {
            this.setState({
                status: 'wrong',
                message: 'Password is wrong, try again.'
            });
        }
    }

    onStart() {
        this.setState({
            status: 'normal',
            message: 'Please input your password.'
        });
    }

    onReset() {
        this.setState({
            status: 'normal',
            message: 'Please input your password (again).'
        });
    }

    render() {
        if (this.state.spinner == false) {
            return <PasswordGesture
                ref='pg'
                status={this.state.status}
                message={this.state.message}
                onStart={() => this.onStart()}
                onEnd={(password) => this.onEnd(password)}
                innerCircle={true}
                outerCircle={true}
            />
        } else {
            return <Spinner
                visible={this.state.spinner}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
            />
        }
    }
}


const styles = StyleSheet.create({
    spinnerTextStyle: {
        color: '#000000'
    }
});