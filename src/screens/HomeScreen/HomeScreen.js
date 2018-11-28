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





export default class HomeScreen extends React.Component {
    render() {
        return (
            <Container>
                <Header transparent>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.toggleDrawer()}>
                            <Icon name='bars' size={25} color="#ffffff" />
                        </Button>
                    </Left>

                    <Body>
                        <Title>Header</Title>
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
                    <Text>
                        This is Content Section
              </Text>
                </Content>
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
