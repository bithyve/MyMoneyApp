import React from 'react';
import {
    StyleSheet,
    ImageBackground,
    TouchableOpacity
} from 'react-native';
import { Container, Header, Title, Content, Button, Left, Right, Body, Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
    MKTextField,
    MKColor,
    mdl,
} from 'react-native-material-kit';


const required = value => (value ? undefined : 'This is a required field.');
const email = value => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,5}$/i.test(value) ? 'Please provide a valid email address.' : undefined;

//TODO: Custome Pages
import { colors, images } from "../../../../constants/Constants";

export default class SentMoneyScreen extends React.Component {

    constructor() {
        super();

        this.state = {
            errors: [],
            email: ''
        }
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
                            <Title>Send Money</Title>
                        </Body>
                    </Header>
                    <Content padder>
                        <MKTextField
                            tintColor={colors.appColor}
                            textInputStyle={{ color: colors.black }}
                            placeholder="Recipient Address"
                            style={styles.textfield}
                            validations={[required, email]}
                            name="email"
                            value={this.state.email}
                            onChangeText={(val) => this.setState({ email: val })}
                            customStyle={{ width: 100 }}
                            errors={this.state.errors}
                        />
                        <MKTextField
                            tintColor={colors.appColor}
                            textInputStyle={{ color: colors.black }}
                            placeholder="Account"
                            keyboardType={"numeric"}
                            style={styles.textfield}
                            errors={this.state.errors}
                            va
                        />
                        <Button style={styles.btnSent} full ><Text > SEND </Text></Button>
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
    btnSent: {
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.appColor
    }

});
