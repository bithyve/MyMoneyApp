import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  StatusBar,
  Alert,
  ImageBackground
} from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Left,
  Right,
  Body,
  Text,
  List,
  ListItem,
  Thumbnail
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";

//TODO: Custome Pages
import { colors, images } from "../../../constants/Constants";

export default class MyProfileScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };
  }

  render() {
    return (
      <Container>
        <ImageBackground source={images.appBackgound} style={styles.container}>
          <Header transparent>
            <Left>
              <Button
                transparent
                onPress={() => this.props.navigation.pop()}
              >
                <Icon name="chevron-left" size={25} color="#ffffff" />
              </Button>
            </Left>

            <Body>
              <Title
                adjustsFontSizeToFit={true}
                numberOfLines={1}
                style={styles.titleUserName}
              >
                My Profile
              </Title>
            </Body>
            <Right />
          </Header>
          <Content
            contentContainerStyle={styles.container}
            scrollEnabled={false}
          >
            <Text>Profile</Text>
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
