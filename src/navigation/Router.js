import React, { Component } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet
} from 'react-native';
import { colors } from "../constants/Constants";

import { createStackNavigator, createDrawerNavigator, createBottomTabNavigator, } from "react-navigation";
import Icon from 'react-native-vector-icons/FontAwesome';




import LoginScreen from "../screens/LoginScreen/LoginScreen";
import HomeScreen from "../screens/HomeScreen/HomeScreen";



//OnBoarding
import OnBoardingScreen from "../screens/WalletScreen/OnBoardingScreen/OnBoardingScreen";
import BackupPhraseScreen from "../screens/WalletScreen/BackupPhraseScreen/BackupPhraseScreen";
import VerifyBackupPhraseScreen from "../screens/WalletScreen/VerifyBackupPhraseScreen/VerifyBackupPhraseScreen";


//Password 
import PasswordGestureScreen from "../screens/PasswordGestureScreen/PasswordGestureScreen";


//Tabbar Bottom
import PaymentScreen from "../screens/TabBarScreen/PaymentScreen/PaymentScreen";
import AnalyticsScreen from "../screens/TabBarScreen/AnalyticsScreen/AnalyticsScreen";
import AccountsScreen from "../screens/TabBarScreen/AccountsScreen/AccountsScreen";
import CardsScreen from "../screens/TabBarScreen/CardsScreen/CardsScreen";
import MoreScreen from "../screens/TabBarScreen/MoreScreen/MoreScreen";

//DrawerScreen
import AccountSettingScreen from "../screens/DrawerScreen/AccountSettingScreen/AccountSettingScreen";
import SecurityScreen from "../screens/DrawerScreen/SecurityScreen/SecurityScreen";
import HelpScreen from "../screens/DrawerScreen/HelpScreen/HelpScreen";
import InviteScreen from "../screens/DrawerScreen/InviteScreen/InviteScreen";
import BankAccountScreen from "../screens/DrawerScreen/BankAccountScreen/BankAccountScreen";
import LogoutScreen from "../screens/DrawerScreen/LogoutScreen/LogoutScreen";
import DrawerScreen from "../screens/DrawerScreen/DrawerScreen/DrawerScreen";


//TODO: ONBoarding
const OnBoardingRouter = createStackNavigator({
  OnBoarding: {
    screen: OnBoardingScreen,
    navigationOptions:
      { header: null }
  },
  BackupPhrase: {
    screen: BackupPhraseScreen,
    navigationOptions:
      { header: null }
  },
  VerifyBackupPhrase: {
    screen: VerifyBackupPhraseScreen,
    navigationOptions: () => ({
      title: 'Verify Backup Phrase',
      headerTintColor: '#ffffff',
      headerStyle: {
        backgroundColor: '#F5951D',
      },
    }),
  },
},
  {
    initialRouteName: 'OnBoarding'
  });



//TODO: Login 
const LoginRouter = createStackNavigator({
  Login: {
    screen: LoginScreen,
    navigationOptions:
      { header: null }
  }
},
  {
    initialRouteName: 'Login'
  });



//TODO: TabNavigator

const TabNavigator = createBottomTabNavigator({
  Payment: {
    screen: PaymentScreen,
    navigationOptions: {
      tabBarLabel: "Payment",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="credit-card" size={20} color={tintColor} />
      )
    }
  },
  Analytics: {
    screen: AnalyticsScreen,
    navigationOptions: {
      tabBarLabel: "Analytics",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="signal" size={20} color={tintColor} />
      )
    }
  },
  Accounts: {
    screen: AccountsScreen,
    navigationOptions: {
      tabBarLabel: "Accounts",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="dollar" size={20} color={tintColor} />
      )
    }
  },
  Cards: {
    screen: CardsScreen,
    navigationOptions: {
      tabBarLabel: "Cards",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="id-card" size={20} color={tintColor} />
      )
    }
  },
  More: {
    screen: MoreScreen,
    navigationOptions: {
      tabBarLabel: "More",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="ellipsis-v" size={20} color={tintColor} />
      )
    }
  },
},
  {
    tabBarOptions: {
      activeTintColor: '#f3882a',
      labelStyle: {
        fontSize: 12,
      },
      style: {
        backgroundColor: '#ffffff',
      },
    }
  }

);


//TODO: DrawerNavigator

const LeftDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: TabNavigator,
    navigationOptions: {
      drawerLabel: 'Home',
      drawerIcon: ({ tintColor }) => <Icon name="home" size={17} />,

    }
  }
}, {
    initialRouteName: 'Home',
    contentComponent: DrawerScreen,
    drawerWidth: 300
  });


export const createRootNavigator = (
  signedIn = false,
  screenName = "Password"
) => {
  if (screenName == "Password" || screenName == "Home") {
    return createStackNavigator(
      {
        PasswordGesture: {
          screen: PasswordGestureScreen,
          navigationOptions:
            { header: null }
        },
        OnBoardingNavigator: {
          screen: OnBoardingRouter,
          navigationOptions:
            { header: null }
        },
        TabbarBottom: {
          screen: LeftDrawerNavigator,
          navigationOptions:
            { header: null }
        }
      },
      {
        initialRouteName: signedIn ? "TabbarBottom" : "TabbarBottom"
        //initialRouteName: signedIn ? "PasswordGesture" : "PasswordGesture"
      }
    );
  } else {
    return createStackNavigator(
      {
        PasswordGesture: {
          screen: PasswordGestureScreen,
          navigationOptions:
            { header: null }
        },
        OnBoardingNavigator: {
          screen: OnBoardingRouter,
          navigationOptions:
            { header: null }
        },
        LoginNavigator: {
          screen: LoginRouter,
          navigationOptions:
            { header: null }
        },
        TabbarBottom: {
          screen: LeftDrawerNavigator,
          navigationOptions:
            { header: null }
        }
      },
      {
        initialRouteName: signedIn ? "TabbarBottom" : "TabbarBottom"
        //initialRouteName: signedIn ? "OnBoardingNavigator" : "PasswordGesture"
      }
    );
  }
};