import React, { Component } from "react";
import { FlatList, View, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import Onboarding from "react-native-onboarding-swiper";

import {
  colors,
  images,
  localDB,
  notification
} from "../../constants/Constants";
import renderIf from "../../constants/validation/renderIf";
var utils = require("../../../app/constants/Utils");

interface Props {
  data: [];
  click_Done: Function;
}

export default class ViewOnBoarding extends Component<Props, any> {
  constructor(props: any) {
    super(props);
  }

  //TODO: renderItem
  renderItem(item: any) {
    let i: number;
    let swipItem: any[] = [];
    for (i = 0; i < item.length; i++) {
      swipItem.push({  
        backgroundColor: item[i].backgroundColor,
        image: (
          <Image
            style={{ width: 200, height: 200, borderRadius: 100 }}
            resizeMode="cover"  
            source={item[i].image}  
          />
        ),
        title: item[i].title,
        subtitle: item[i].subtitle
      });
    }
    return swipItem;
  }

  render() {
    return (
      <Onboarding
        onDone={() => this.props.click_Done()}
        onSkip={() => this.props.click_Done()}
        pages={this.renderItem(this.props.data)}
      />
    );
  }
}
