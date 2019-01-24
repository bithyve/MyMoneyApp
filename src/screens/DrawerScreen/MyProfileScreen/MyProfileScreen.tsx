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
  KeyboardAvoidingView,
  ImageBackground,
  CameraRoll
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
  Input,
  List,
  ListItem,
  Thumbnail
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome5";
import CountryPicker, {
  getAllCountries
} from "react-native-country-picker-modal";
import { SCLAlert, SCLAlertButton } from "react-native-scl-alert";
import ImagePicker from "react-native-image-picker";
import BackboneEvents from "backbone-events-standalone";

window.EventBus = BackboneEvents.mixin({});

import closeImgLight from "MyMoney/src/assets/images/mobileNoDetailsScreen/countryPickerClose.png";
const INDIA = ["IN"];
const DARK_COLOR = "#18171C";
const PLACEHOLDER_COLOR = "rgba(255,255,255,0.2)";
const LIGHT_COLOR = "#FFF";

//TODO: Custome Pages
import { colors, images, localDB } from "../../../app/constants/Constants";
var dbOpration = require("../../../app/manager/database/DBOpration");
var utils = require("../../../app/constants/Utils");
import renderIf from "../../../app/constants/validation/renderIf";
let isNetwork;
//import styles from './Styles';
import { Response } from "superagent";

export default class MyProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      popUpMessage: [],
      id: null,
      firstName: null,
      lastName: null,
      countryCode: null,
      countryName: null,
      mobileNo: null,
      email: null,
      imagePath: null,
      cca2: "",
      callingCode: ""
    };
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
  }

  componentWillMount() {
    this.connnection_GetUserDetails();
  }

  async connnection_GetUserDetails() {
    const resultUserDetails = await dbOpration.readTablesData(
      localDB.tableName.tblUser
    );
    let countryCode = resultUserDetails.temp[0].cca2;
    const userCountryData = getAllCountries()
      .filter(country => countryCode.includes(country.cca2))
      .pop();
    this.setState({
      data: resultUserDetails.temp,
      id: resultUserDetails.temp[0].id,
      firstName: resultUserDetails.temp[0].firstName,
      lastName: resultUserDetails.temp[0].lastName,
      countryName: resultUserDetails.temp[0].country,
      mobileNo: resultUserDetails.temp[0].mobileNo,
      email: resultUserDetails.temp[0].email,
      imagePath: { uri: resultUserDetails.temp[0].imagePath },
      cca2: resultUserDetails.temp[0].cca2,
      callingCode: userCountryData.callingCode,
      isMessagePopup: false
    });
  }

  //TODO: func validation
  validation(val, type) {}

  //TODO: func updateProfile

  async updateProfile() {
    const dateTime = Date.now();
    const lastUpdateDate = Math.floor(dateTime / 1000);
    const resultRecentTransaction = await dbOpration.updateUserDetails(
      localDB.tableName.tblUser,
      this.state.firstName,
      this.state.lastName,
      this.state.countryName,
      this.state.cca2,
      this.state.mobileNo,
      this.state.email,
      lastUpdateDate,
      this.state.id
    );
    if (resultRecentTransaction) {
      this.setState({
        isMessagePopup: true,
        popUpMessage: [
          {
            status: "success",
            title: "Success!!",
            message: "Profile updated.",
            icon: "smile",
            flagGoBack: true
          }
        ]
      });
    } else {
      this.setState({
        isMessagePopup: true,
        popUpMessage: [
          {
            status: "danger",
            title: "Ooops!!",
            message: "No profile updated.",
            icon: "frown",
            flagGoBack: false
          }
        ]
      });
    }
  }

  //TODO: func click_SelectImage
  async selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);
      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        let source = { uri: response.uri };
        // You can also display the image using data:
        //let sourcebase64 = { uri: "data:image/jpeg;base64," + response.data };
        //update imagePath in database tbluser
        (async () => {
          try {
            const resultRecentTransaction = await dbOpration.updateUserProfilePic(
              localDB.tableName.tblUser,
              response.uri,
              this.state.id
            );
            if (resultRecentTransaction) {
              window.EventBus.trigger(    
                notification.notifi_UserDetialsChange,
                "success"
              );
              let status = await this.getStatusSaveIamge(response.uri);
              if (status) {
                this.setState({
                  isMessagePopup: true,
                  popUpMessage: [
                    {
                      status: "success",
                      title: "Success!!",
                      message: "Profile Picture Changed.",
                      icon: "smile",
                      flagGoBack: false
                    }
                  ],
                  imagePath: source
                });
              }
            } else {
              this.setState({
                isMessagePopup: true,
                popUpMessage: [
                  {
                    status: "danger",
                    title: "Ooops!!",
                    message: "No profile picture changed.",
                    icon: "frown",
                    flagGoBack: false
                  }
                ],
                imagePath: source
              });
            }
          } catch (err) {
            console.log(err);
          }
        })();
      }
    });
  }

  getStatusSaveIamge(uri) {
    return new Promise(resolve => {
      // CameraRoll.saveToCameraRoll(uri, "photo")
      //   .then(function(result) {
      //     console.log("save succeeded " + result);
      //     resolve(true);
      //   })
      //   .catch(function(error) {
      //     console.log("save failed " + error);
      //     resolve(false);
      //   });
      resolve(true);
    });
  }

  //TODO: Show Popup
  showMessage(flag) {
    console.log(flag);
  }

  render() {
    return (
      <Container>
        <ImageBackground source={images.appBackgound} style={styles.container}>
          <Header transparent>
            <Left>
              <Button transparent onPress={() => this.props.navigation.pop()}>
                <Icon name="chevron-left" size={25} color="#ffffff" />
              </Button>
            </Left>

            <Body style={{ flex: 0, alignItems: "center" }}>
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
            scrollEnabled={true}
          >
            <View style={styles.viewProfileIcon}>
              <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                {renderIf(JSON.stringify(this.state.imagePath).length < 15)(
                  <Image
                    style={[styles.userProfileIcon, { marginBottom: -150 }]}
                    source={require("MyMoney/src/assets/images/icon/default_user_icon.png")}
                  />
                )}
                {renderIf(JSON.stringify(this.state.imagePath).length > 15)}
                {
                  <Image
                    style={styles.userProfileIcon}
                    source={this.state.imagePath}
                  />
                }
              </TouchableOpacity>
              <Button
                transparent
                style={styles.btnChangeIcon}
                onPress={this.selectPhotoTapped.bind(this)}
              >
                <Text
                  style={[
                    styles.titleUserName,
                    {
                      fontWeight: "bold",
                      fontSize: Platform.OS == "ios" ? 20 : 16
                    }
                  ]}
                >
                  Change Profile Picture
                </Text>
              </Button>
            </View>

            <View style={styles.viewUserDetails}>
              <View style={styles.viewUserDetailsName}>
                <Input
                  name={this.state.firstName}
                  value={this.state.firstName}
                  placeholder="First Name"
                  placeholderTextColor={colors.placeholder}
                  style={[styles.input, { marginRight: 5 }]}
                  onChangeText={val => this.setState({ firstName: val })}
                />
                <Input
                  name={this.state.lastName}
                  value={this.state.lastName}
                  placeholder="Last Name"
                  placeholderTextColor={colors.placeholder}
                  style={[styles.input, { marginLeft: 5 }]}
                  onChangeText={val => this.setState({ lastName: val })}
                />
              </View>

              <View
                style={[
                  styles.countryView,
                  {
                    borderBottomWidth: 1,
                    borderBottomColor: "#000",
                    alignItems: "center"
                  }
                ]}
              >
                <CountryPicker
                  filterPlaceholderTextColor={PLACEHOLDER_COLOR}
                  closeButtonImage={closeImgLight}
                  styles={[darkTheme]}
                  filterable={true}
                  onChange={value => {
                    this.setState({
                      countryName: value.name,
                      cca2: value.cca2,
                      callingCode: value.callingCode
                    });
                  }}
                  cca2={this.state.cca2}
                  translation="eng"
                />
                <Text style={styles.txtcountryName}>
                  {this.state.countryName}
                </Text>
              </View>

              <View style={styles.callingDetailsView}>
                <Text>+ {this.state.callingCode}</Text>
                <Input
                  name={this.state.mobileNo}
                  value={this.state.mobileNo}
                  keyboardType={"phone-pad"}
                  placeholder="Mobile Number"
                  placeholderTextColor={colors.placeholder}
                  style={styles.input}
                  onChangeText={val => this.setState({ mobileNo: val })}
                />
              </View>
              <View style={styles.viewEmail}>
                <Input
                  name={this.state.email}
                  value={this.state.email}
                  keyboardType={"email-address"}
                  placeholder="Email Address"
                  placeholderTextColor={colors.placeholder}
                  style={styles.input}
                  onChangeText={val => this.setState({ email: val })}
                />
              </View>
              <View style={styles.viewBtnUpdate}>
                <Button
                  style={[{ backgroundColor: colors.appColor, marginTop: 20 }]}
                  full
                  onPress={() => this.updateProfile()}
                >
                  <Text> UPDATE </Text>
                </Button>
              </View>
            </View>
          </Content>
        </ImageBackground>

        <SCLAlert
          theme={
            this.state.popUpMessage.length != 0
              ? this.state.popUpMessage[0].status
              : null
          }
          show={this.state.isMessagePopup}
          cancellable={false}
          headerIconComponent={
            <Icon
              name={
                this.state.popUpMessage.length != 0
                  ? this.state.popUpMessage[0].icon
                  : null
              }
              size={50}
              color="#fff"
            />
          }
          title={
            this.state.popUpMessage.length != 0
              ? this.state.popUpMessage[0].title
              : null
          }
          subtitle={
            this.state.popUpMessage.length != 0
              ? this.state.popUpMessage[0].message
              : null
          }
        >
          <SCLAlertButton
            theme={
              this.state.popUpMessage.length != 0
                ? this.state.popUpMessage[0].status
                : null
            }
            onPress={() => {
              this.setState({
                isMessagePopup: false
              });
              if (this.state.popUpMessage[0].flagGoBack) {
                window.EventBus.trigger(
                  notification.notifi_UserDetialsChange,
                  "success"
                );
                this.props.navigation.pop();
              }
            }}
          >
            Ok
          </SCLAlertButton>
        </SCLAlert>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  titleUserName: {
    color: "#ffffff"
  },
  viewProfileIcon: {
    flex: 0.44,
    alignItems: "center"
  },
  userProfileIcon: {
    marginTop: Platform.OS == "ios" ? 30 : 5,
    height: 120,
    width: 120,
    borderRadius: 60
  },
  //btn:btnChangeIcon
  btnChangeIcon: {
    color: "#fff",
    alignSelf: "center"
  },
  //view:viewUserDetails
  viewUserDetails: {
    flex: 0.49,
    padding: 20
  },
  //view:viewInLine
  viewUserDetailsName: {
    flex: 0.3,
    flexDirection: "row"
  },
  //input:input
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    color: "#000"
  },
  //view:countryView
  countryView: {
    flex: 0.1,
    flexDirection: "row",
    paddingBottom: 10
  },
  //txt:txtcountryName
  txtcountryName: {
    marginLeft: 30,
    textAlign: "center",
    fontSize: 18
  },
  //view:callingDetailsView
  callingDetailsView: {
    flex: 0.3,
    flexDirection: "row",
    alignItems: "center"
  },
  //txt:callingCode
  callingCode: {
    fontSize: 10,
    fontWeight: "bold"
  },
  //view:viewEmail
  viewEmail: {
    flex: 0.2
  },
  //btn:viewBtnUpdate
  viewBtnUpdate: {
    flex: 0.3,
    justifyContent: "flex-end"
  }
});

const darkTheme = StyleSheet.create({
  modalContainer: {
    backgroundColor: DARK_COLOR
  },
  contentContainer: {
    backgroundColor: DARK_COLOR
  },
  header: {
    backgroundColor: DARK_COLOR
  },
  itemCountryName: {
    borderBottomWidth: 0
  },
  countryName: {
    color: LIGHT_COLOR
  },
  letterText: {
    color: LIGHT_COLOR
  },
  input: {
    color: LIGHT_COLOR,
    borderBottomWidth: 1,
    borderColor: LIGHT_COLOR
  }
});
