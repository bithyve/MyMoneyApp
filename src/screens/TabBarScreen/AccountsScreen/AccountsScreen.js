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
} from 'react-native';
import { Container, Header, Title, Content, Button, Left, Right, Body, Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';





export default class AccountsScreen extends React.Component {
    render() {
        return (
            <Container>
                <ImageBackground
                    source={require("../../../../assets/images/homescreen/homeBackgoundImage.png")}
                    style={styles.container}
                >

                    <Header transparent>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.toggleDrawer()}>
                                <Icon name='bars' size={25} color="#ffffff" />
                            </Button>
                        </Left>

                        <Body>
                            <Title>Anant Tapadia</Title>
                        </Body>
                        <Right>
                            <Button transparent>
                                <Icon name='bell' size={15} color="#ffffff" />
                            </Button>
                            <Button transparent>
                                <Icon name='plus' size={25} color="#ffffff" />
                            </Button>
                        </Right>
                    </Header>
                    <Content>

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
    }
});
