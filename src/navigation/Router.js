import React, { Component } from 'react';
import { createStackNavigator, createDrawerNavigator, createBottomTabNavigator, } from "react-navigation";
import { Icon } from "react-native-elements";

import OnBoardingScreen from "../screens/OnBoardingScreen/OnBoardingScreen";
import LoginScreen from "../screens/LoginScreen/LoginScreen";
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import SettingScreen from "../screens/SettingScreen/SettingScreen";

  

const AppNavigator = createStackNavigator({
  Login: {
    screen: LoginScreen,
    navigationOptions:
      { header: null }
  },
  Home: {
    screen: HomeScreen
  }
},
  {
    initialRouteName: 'Login'
  });

const TabNavigator = createBottomTabNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarLabel: "Home",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="home" size={30} color={tintColor} />
      )
    }
  },
},
  {
    tabBarOptions: {
      activeTintColor: '#e91e63',
      labelStyle: {
        fontSize: 12,
      },
      style: {
        backgroundColor: 'blue',
      },
    }
  }

);

//Drawer Extention

// const DrawerRouteConfig = {
//   Home: {
//     screen: TabNavigator,
//     navigationOptions: {
//       drawerLabel: 'Home',
//       drawerIcon: ({ tintColor }) => <Icon name="home" size={17} />,

//     }
//   },
//   Settings: {
//     screen: SettingScreen,
//     navigationOptions: {
//       drawerLabel: 'Settings',
//       drawerIcon: ({ tintColor }) => <Icon name="settings" size={17} />,
//     }
//   },
// }

// /**
// * navigation animation option
// */
// const DrawerNavigationConfig = {
//   contentComponent: SideMenu
// };
   
// const LeftDrawerNavigator = createDrawerNavigator(DrawerRouteConfig,DrawerNavigationConfig);
   

const LeftDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: TabNavigator,
    navigationOptions: {
      drawerLabel: 'Home',
      drawerIcon: ({ tintColor }) => <Icon name="home" size={17} />,

    }
  },
  Settings: {
    screen: SettingScreen,
    navigationOptions: {
      drawerLabel: 'Settings',
      drawerIcon: ({ tintColor }) => <Icon name="settings" size={17} />,
    }
  },   
},{
  drawerBackgroundColor: '#B16270',   
  drawerPosition: 'left',
  navigationOptions : {
    drawerLockMode: 'locked-open',
},   
});  






export const createRootNavigator = (
  signedIn = false
) => {
  return createStackNavigator(
    {
      LoginRouter: {
        screen: AppNavigator,
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
      initialRouteName: signedIn ? "LoginRouter" : "TabbarBottom"
    }
  );
};  