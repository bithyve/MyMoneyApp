import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import {
  Container,
  Content,
  Button,
  Form,
  Item,
  Label,
  Input,
  Right,
  Body,
  Text,
  Footer
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-simple-toast";

//TODO: Custome Pages
import { colors, images } from "../../../constants/Constants";

const width = Dimensions.get("window").width;

export default class UserEmailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      continueBtnColor: "gray",
      continueBtnStatus: true,
      note:
        "Don't worry; we'll never sell your email for third party marketng purpose."
    };
  }

  componentWillMount() {
    const { navigation } = this.props;
    this.setState({
      firstName: navigation.getParam("firstName"),
      lastName: navigation.getParam("lastName")
    });
  }

  //TODO: func validationText
  validationText(text, type) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(text)) {
      this.setState({
        email: text,
        continueBtnColor: colors.appColor,
        continueBtnStatus: false
      });
    } else {
      this.setState({
        continueBtnColor: "gray",
        continueBtnStatus: true
      });
    }
  }

  click_Continue() {
    this.props.navigation.push("UserMobileNoScreen", {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email
    });
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.container}>
          <View style={styles.whatnameTitle}>
            <Text style={styles.txtTitle}>What is your email?</Text>
          </View>
          <View style={styles.inputFormView}>
            <Form>
              <Item floatingLabel>
                <Label>Email</Label>
                <Input
                  name={this.state.email}
                  keyboardType={"email-address"}
                  autoCapitalize="none"
                  onChangeText={text => this.validationText(text, "email")}
                />
              </Item>
              <Text
                style={{
                  alignSelf: "center",
                  textAlign: "center",
                  marginLeft: 50,
                  marginRight: 50,
                  marginTop: 5
                }}
                note
              >
                {this.state.note}
              </Text>
            </Form>
          </View>
        </Content>
        <Footer style={{ backgroundColor: this.state.continueBtnColor }}>
          <Button
            full
            disabled={this.state.continueBtnStatus}
            style={styles.btnContinue}
            transparent
            onPress={() => this.click_Continue()}
          >
            <Text style={{ color: "#ffffff" }}>Continue</Text>
          </Button>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  whatnameTitle: {
    flex: 0.4,
    alignItems: "center",
    justifyContent: "flex-end"
  },
  txtTitle: {
    color: colors.appColor,
    fontSize: 20
  },
  inputFormView: {
    flex: 4,
    marginRight: 10
  },
  btnContinue: {
    alignSelf: "center"
  }
});
