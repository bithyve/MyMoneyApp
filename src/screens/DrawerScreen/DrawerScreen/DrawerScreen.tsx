import React, { Component } from "react";
import { NavigationActions } from "react-navigation";
import PropTypes from "prop-types";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  ImageBackground,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Alert
} from "react-native";
import {
  Container,
  Header,
  Title,
  Content,   
  Button,
  Left,
  Right,
  Thumbnail
} from "native-base";
import { DrawerActions } from "react-navigation";
import Icon from "react-native-vector-icons/FontAwesome";
import Dialog, {
  SlideAnimation,
  DialogTitle,
  DialogContent,
  DialogButton
} from "react-native-popup-dialog";

//TODO: Custome Pages
import { colors, images, localDB } from "../../../app/constants/Constants";

//TODO: Json Files
import menuData from "../../../assets/jsonfiles/drawerScreen/leftMenuList.json";

class DrawerScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuBarList: []
    };
  }

  //TODO: Page Life Cycle
  componentDidMount() {
    this.getLeftMenuList();
  }
  getLeftMenuList() {
    this.setState({
      menuBarList: menuData.menus
    });
  }
  //TODO: Func show logout popup
  click_Logout() {
    Alert.alert("Working");
    this.props.navigation.dispatch(DrawerActions.closeDrawer());
  }

  //TODO:  function NavigateToScreen
  navigateToScreen = route => () => {
    if (route == "Home") {
      const navigateAction = NavigationActions.navigate({
        routeName: route
      });
      this.props.navigation.dispatch(navigateAction);
      this.props.navigation.dispatch(DrawerActions.closeDrawer());
    } else if (route == "LogoutScreen") {
      this.click_Logout();
    } else {
      this.props.navigation.push(route);
      this.props.navigation.dispatch(DrawerActions.closeDrawer());
    }
  };

  render() {
    return (
      <Container>
        <ImageBackground source={images.slideMenuIcon} style={styles.container}>
          <ScrollView style={styles.viewScrollingList}>
            <View>
              <FlatList
                data={this.state.menuBarList}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={this.navigateToScreen(item.pageName)}
                  >
                    <View style={styles.menuItem}>
                      <Icon name={item.icon} size={30} color="#ffffff" />
                      <Text style={styles.txtMenuItem}>{item.title}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item,index) => index}
              />
            </View>
          </ScrollView>
        </ImageBackground>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30
  },
  menuItem: {
    padding: 10,
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: "#d6d7da",
    alignItems: "center"
  },
  txtMenuItem: {
    paddingLeft: 10,
    color: "#ffffff",
    fontSize: 20
  },
  //Scrolling:viewScrollingList
  viewScrollingList: {
    flex: 1
  }
});

DrawerScreen.propTypes = {
  navigation: PropTypes.object
};

export default DrawerScreen;
