import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  ImageBackground,
  RefreshControl
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
  Text
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";

//TODO: Custome Pages
import { colors, images } from "../../../constants/Constants";

export default class RecentTransactionsScreen extends React.Component {
  //TODO: func refresh
  refresh() {
    this.setState({ refreshing: true });
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }

  render() {
    return (
      <Container>
        <Content
          contentContainerStyle={styles.container}
        
        >
          <View>
            <Text>Hi</Text>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
