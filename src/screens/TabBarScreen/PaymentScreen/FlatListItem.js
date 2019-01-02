import React, { PureComponent } from 'react'
import { StyleSheet, View, Alert, TouchableOpacity, Image, TouchableHighlight,Dimensions } from 'react-native'
import { Button, ListItem, Left, Right, Body, Thumbnail, Text, Icon } from 'native-base'
import styles from './Styles';

//const logo = require('../../../assets/images/defulatUserIcon.png')

const { width, height } = Dimensions.get('window')
export default class FlatListItem extends PureComponent {
  constructor(props) {
    super(props)
  }   

  render() {
    const rowID = this.props.index
    const rowData = this.props.item
    return (
      <ListItem
        thumbnail
        style={{ backgroundColor: '#000000', marginBottom: 10, padding: 5, borderRadius: 10, width: width - 30 }}  
      >
        <Left>
          {/* <Thumbnail square source={logo} style={styles.thumb} /> */}
        </Left>   
        <Body style={{ borderBottomWidth: 0 }}>
          <Text>RowID: {rowID}</Text>
          <Text note>Data: {rowData}</Text>
        </Body>
        
      </ListItem>
    )
  }
}