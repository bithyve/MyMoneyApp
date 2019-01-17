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
import { colors, images, localDB } from "../../../constants/Constants";
var dbOpration = require("../../../manager/database/DBOpration");

//TODO: Json Files
import menuData from "../../../assets/jsonfiles/drawerScreen/leftMenuList.json";

class DrawerScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuBarList: [],
      userDetails: [],
      fullName: ""
    };
    this.click_Logout = this.click_Logout.bind(this);
  }

  //TODO: Page Life Cycle
  componentDidMount() {
    this.getLeftMenuList();
    this.getUserDetails();
  }

  async getUserDetails() {
    const result = await dbOpration.readTablesData(localDB.tableName.tblUser);
    this.setState({
      userDetails: result.temp,
      fullName: result.temp[0].firstName + " " + result.temp[0].lastName
    });
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
          <View style={styles.viewHeading}>
            <View style={styles.viewUserIcon}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.closeDrawer();
                  this.props.navigation.push("MyProfileRouter");
                }}   
              >
                <Image
                  style={styles.userProfileIcon}
                  source={require("../../../assets/images/icon/default_user_icon.png")}
                />
                <Icon
                  name="edit"
                  style={styles.iconEdit}
                  size={25}
                  color="#ffffff"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.txtUserName}>{this.state.fullName}</Text>
          </View>

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
                keyExtractor={item => item.id}
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
  viewHeading: {
    flex: 0.5,
    marginTop: 10,
    alignItems: "center"
  },
  userProfileIcon: {
    width: 140,
    height: 140,
    borderRadius: 70
  },
  viewUserIcon: {       
    flexDirection: "row",
    alignItems: "flex-end"
  },
  iconEdit: {
    alignSelf: "flex-end",
    marginTop: -30
  },
  txtUserName: {   
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 24,
    marginTop: 10,
    marginBottom: 10
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
