import React from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    KeyboardAvoidingView,
    ScrollView,
    Platform
} from 'react-native';
import { Container, Content, Button, Form, Item, Label, Input, Right, Body, Text, Footer } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-simple-toast';

const width = Dimensions.get('window').width;
const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;

//TODO: Custome Pages
import { colors, images } from "../../../constants/Constants";

export default class UsernameScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            firstName: '',
            lastName: '',
            continueBtnColor: 'gray',
            continueBtnStatus: true
        });

    }

    //TODO: func validationText
    validationText(text, type) {
        if (type == "firstName") {
            this.setState({
                firstName: text
            })
        } else {
            this.setState({
                lastName: text
            })
        }
        if (this.state.firstName.length > 0 && this.state.lastName.length > 0) {
            this.setState({
                continueBtnColor: colors.appColor,
                continueBtnStatus: false
            })
        }
        if (this.state.firstName.length < 0 || this.state.lastName.length < 0 || text == '') {
            this.setState({
                continueBtnColor: 'gray',
                continueBtnStatus: true
            })
        }


    }

    click_Continue() {
        if (this.state.firstName == '' || this.state.lastName == '') {
            Toast.show('Please enter username and lastname !!', Toast.SHORT);
        } else {
            this.props.navigation.push('UserEmailScreen',
                {
                    firstName: this.state.firstName,
                    lastName: this.state.lastName
                });
        }
    }




    render() {
        return (

            <Container >
                <Content contentContainerStyle={styles.container}>
                    <View style={styles.whatnameTitle}>
                        <Text style={styles.txtTitle}>What is your name?</Text>
                    </View>
                    <View style={styles.inputFormView} >
                        <Form>
                            <Item floatingLabel >
                                <Label>First Name</Label>
                                <Input
                                    name={this.state.firstName}
                                    keyboardType={"default"}
                                    onChangeText={(text) => this.validationText(text, 'firstName')}
                                />
                            </Item>
                            <Item floatingLabel >
                                <Label>Last Name</Label>
                                <Input
                                    name={this.state.lastName}
                                    onChangeText={(text) => this.validationText(text, 'lastName')} />
                            </Item>

                        </Form>

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
        marginRight: 10,
    },
    btnContinue: {
        alignSelf: 'center'
    },
    //Validation


});
