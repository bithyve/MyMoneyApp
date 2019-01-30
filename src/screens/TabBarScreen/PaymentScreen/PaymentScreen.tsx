import React from "react";
import {
  View,
  Alert,
  ImageBackground,
  Dimensions,
  StatusBar,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  RefreshControl,
  ScrollView
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
import { RkCard } from "react-native-ui-kitten";
import { StackActions, NavigationActions } from "react-navigation";
import Carousel, { Pagination } from "react-native-snap-carousel";
import CardFlip from "react-native-card-flip";
import Icon from "react-native-vector-icons/FontAwesome";
import Dialog, {
  SlideAnimation,
  DialogTitle,
  DialogContent,
  DialogButton
} from "react-native-popup-dialog";
import { DotIndicator, SkypeIndicator } from "react-native-indicators";

//TODO: Custome Pages
import { colors, images, localDB } from "../../../app/constants/Constants";

export default class PaymentScreen extends React.Component {
  constructor(props) {
    super(props);
    StatusBar.setBackgroundColor(colors.appColor, true);
    this.state = {};
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.container}>
          <ImageBackground
            source={images.appBackgound}
            style={styles.backgroundImage}
            imageStyle={{
              resizeMode: "cover" // works only here!
            }}
          >
            <Header transparent>
              <Left>
                <Button
                  transparent
                  onPress={() => this.props.navigation.toggleDrawer()}
                >
                  <Icon name="bars" size={25} color="#ffffff" />
                </Button>
              </Left>
              <Body style={{ flex: 0, alignItems: "center" }}>
                <Title
                  adjustsFontSizeToFit={true}
                  numberOfLines={1}
                  style={styles.titleUserName}
                >
                  My Money
                </Title>
              </Body>
              <Right />
            </Header>
          </ImageBackground>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  backgroundImage: {
    flex: 1,
    width: "100%"
  }
});
