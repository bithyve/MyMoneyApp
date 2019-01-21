import React from 'react'
import { StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

const KeyboardAvoidingView = props => (
  <View {...props} style={[styles.container, props.styles]} />
)

KeyboardAvoidingView.propTypes = {
  offset: PropTypes.number,
  children: PropTypes.node,
  styles: PropTypes.array
}

export default KeyboardAvoidingView
