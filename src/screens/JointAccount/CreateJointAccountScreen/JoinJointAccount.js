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


//TODO: Custome Pages
import { colors, images } from "../../../constants/Constants";



export default class HelpScreen extends React.Component {
    render() {
        const { id } = this.props.navigation.state.params;
        console.log("after link",id)
        return (
            <Container>
                <ImageBackground
                    source={images.appBackgound}
                    style={styles.container}
                >
  
                    <Header transparent>
                    <Left>
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name='chevron-left' size={25} color="#ffffff" />
                            </Button>
                        </Left>

                        <Body>
                            <Title adjustsFontSizeToFit={true}
                                numberOfLines={1} style={styles.titleUserName}>Join Account</Title>
                        </Body>
                       <Right></Right>
                    </Header>
                    <Content>
                        <Text>
                            This is Join Joint Account Section
              </Text>
              <Text>
                            {id}
              </Text>
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
    titleUserName: {
        color: "#ffffff"
      },
});
