# MyMoneyApp

My Money App Alpha Release

# System Environment

### Step 1:(NodeJS)

Please check nodejs environment<br />
npm -v<br />
(if not set to donload nodejs setup and install )<br />
download link (always use recommended for most use):https://nodejs.org/en/<br />

### Step 2:(React-Native)

All Step flow(Click on build project react code)<br />
https://facebook.github.io/react-native/docs/getting-started<br />

### Step 3:(rn-nodeify)

Install link : https://www.npmjs.com/package/rn-nodeify<br />
1.npm i --save react-native-crypto<br />
2.npm i --save react-native-randombytes<br />
3.npm i --save-dev mvayngrib/rn-nodeify<br />

==========> imp <===========<br />
Check /Users/..(bithyve)/ folder inside<br />
1.First delete all files & Folder like<br />
(pacakge.json,pacakge-lock.json,node_moduels,shim.js,.npm,.node-gyp)<br />

2.Create new pacakge.json file and paste inside file code<br />
Two method solve 1.<br />

```javascript
{
"dependencies": {
"react": "16.6.3",
"react-native": "0.57.8"
},
"repository": {
"private": true
},
"react-native": {
"zlib": "browserify-zlib",
"console": "console-browserify",
"constants": "constants-browserify",
"crypto": "react-native-crypto",
"dns": "dns.js",
"net": "react-native-tcp",
"domain": "domain-browser",
"http": "@tradle/react-native-http",
"https": "https-browserify",
"os": "react-native-os",
"path": "path-browserify",
"querystring": "querystring-es3",
"fs": "react-native-level-fs",
"\_stream_transform": "readable-stream/transform",
"\_stream_readable": "readable-stream/readable",
"\_stream_writable": "readable-stream/writable",
"\_stream_duplex": "readable-stream/duplex",
"\_stream_passthrough": "readable-stream/passthrough",
"dgram": "react-native-udp",
"stream": "stream-browserify",
"timers": "timers-browserify",
"tty": "tty-browserify",
"vm": "vm-browserify",
"tls": false
},
"browser": {
"zlib": "browserify-zlib",
"console": "console-browserify",
"constants": "constants-browserify",
"crypto": "react-native-crypto",
"dns": "dns.js",
"net": "react-native-tcp",
"domain": "domain-browser",
"http": "@tradle/react-native-http",
"https": "https-browserify",
"os": "react-native-os",
"path": "path-browserify",
"querystring": "querystring-es3",
"fs": "react-native-level-fs",
"\_stream_transform": "readable-stream/transform",
"\_stream_readable": "readable-stream/readable",
"\_stream_writable": "readable-stream/writable",
"\_stream_duplex": "readable-stream/duplex",
"\_stream_passthrough": "readable-stream/passthrough",
"dgram": "react-native-udp",
"stream": "stream-browserify",
"timers": "timers-browserify",
"tty": "tty-browserify",
"vm": "vm-browserify",
"tls": false
}
}
```

<br />
then<br />
npm install<br />

2.<br />

```javascript
{
"dependencies": {
"react": "16.6.3",
"react-native": "0.57.8"
},
"repository": {
"private": true
}
}
```

<br />
then<br />
rn-nodeify --install --hack<br />
(cmd run then please all file format like step 1)<br />

### Step 4 (Check rn-nodeify work or not)

1.rn-nodeify --install --hack apply all run correct then go to project folder other wise<br />
2.if(main.sartWith issue then )<br />
3.use step3 and method 2 is working<br />

### Step 5 (Project inside cmd)

1.First check package.json correct format like<br />

```javascript
{
"name": "MyMoney",
"version": "0.0.1",
"private": true,
"scripts": {
"start": "node node_modules/react-native/local-cli/cli.js start",
"postinstall": "rn-nodeify --install fs,dgram,process,path,console --hack",
"test": "jest"
},
"dependencies": {
"@tradle/react-native-http": "^2.0.1",
........
}
},
"devDependencies": {
"babel-jest": "23.6.0",
"jest": "23.6.0",
"metro-react-native-babel-preset": "0.51.0",
"react-test-renderer": "16.6.3",
"rn-nodeify": "github:mvayngrib/rn-nodeify"
},
"jest": {
"preset": "react-native"
},
"react-native": {
"zlib": "browserify-zlib",
"console": "console-browserify",
"constants": "constants-browserify",
"crypto": "react-native-crypto",
"dns": "dns.js",
"net": "react-native-tcp",
"domain": "domain-browser",
"http": "@tradle/react-native-http",
"https": "https-browserify",
"os": "react-native-os",
"path": "path-browserify",
"querystring": "querystring-es3",
"fs": "react-native-level-fs",
"\_stream_transform": "readable-stream/transform",
"\_stream_readable": "readable-stream/readable",
"\_stream_writable": "readable-stream/writable",
"\_stream_duplex": "readable-stream/duplex",
"\_stream_passthrough": "readable-stream/passthrough",
"dgram": "react-native-udp",
"stream": "stream-browserify",
"timers": "timers-browserify",
"tty": "tty-browserify",
"vm": "vm-browserify",
"tls": false
},
"browser": {
"zlib": "browserify-zlib",
"console": "console-browserify",
"constants": "constants-browserify",
"crypto": "react-native-crypto",
"dns": "dns.js",
"net": "react-native-tcp",
"domain": "domain-browser",
"http": "@tradle/react-native-http",
"https": "https-browserify",
"os": "react-native-os",
"path": "path-browserify",
"querystring": "querystring-es3",
"fs": "react-native-level-fs",
"\_stream_transform": "readable-stream/transform",
"\_stream_readable": "readable-stream/readable",
"\_stream_writable": "readable-stream/writable",
"\_stream_duplex": "readable-stream/duplex",
"\_stream_passthrough": "readable-stream/passthrough",
"dgram": "react-native-udp",
"stream": "stream-browserify",
"timers": "timers-browserify",
"tty": "tty-browserify",
"vm": "vm-browserify",
"tls": false
}
}
```

<br />

2.Delete package-lock.json,yarn.lock,node_modules folder<br />
3.npm cache clear<br/>
4.npm install(if runtime any issue show like main.startWith then use Step 3 method 2)<br />
5.If no any issue then<br />
6.react-native eject (it use for create fresh android and ios project)<br />
7.react-native link (it use for all lib bind to android and ios project like(sqlite,camera,etc....))<br />

========> Two way run android and ios project with ide without ide<br />
1)With ide<br />
1.Last android project open in android stuido and run<br />
2.ios project open in xcode and run<br />
(but deploy time use pod file and add all package then ios project run and relase file create then share or upload app store(itunne))<br />

2)with ide<br />
1.react-native run-android and see console(react-native log-android)<br />
1.react-native run-ios and see console(react-native log-ios)<br />

# Issue (Adnroid + ios)

<img src="https://github.com/thecryptobee/MyMoneyApp/blob/master/src/assets/issuesImages/images/busyIndicatorIssue.PNG" width="270" height="400"><br/>
Update file
/node_modules/react-native-busy-indicator/index.js

```
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  DeviceEventEmitter,
  ActivityIndicator
} from 'react-native';

import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1
  },

  progressBar: {
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },

  nocontainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 0.001,
    height: 0.001
  },

  overlay: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10
  },

  text: {
    marginTop: 8
  }
});

class BusyIndicator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: props.startVisible
    };
  }

  componentDidMount () {
    this.emitter = DeviceEventEmitter.addListener('changeLoadingEffect', this.changeLoadingEffect.bind(this));
  }

  componentWillUnmount() {
    this.emitter.remove();
  }

  changeLoadingEffect(state) {
    this.setState({
      isVisible: state.isVisible,
      text: state.title ? state.title : this.props.text
    });
  }

  render() {
    if (!this.state.isVisible) {
      return (<View style={styles.nocontainer} />);
    }

    const customStyles = StyleSheet.create({
      overlay: {
        backgroundColor: this.props.overlayColor,
        width: this.props.overlayWidth,
        height: this.props.overlayHeight
      },

      text: {
        color: this.props.textColor,
        fontSize: this.props.textFontSize
      }
    });

    return (
      <View style={styles.container}>
        <View style={[styles.overlay, customStyles.overlay]}>
          <ActivityIndicator
            color={this.props.color}
            size={this.props.size}
            style={styles.progressBar} />

          <Text
            numberOfLines={this.props.textNumberOfLines}
            style={[styles.text, customStyles.text]}>
            {this.state.text}
          </Text>
        </View>
      </View>
    );
  }
}

BusyIndicator.propTypes = {
  color: PropTypes.string,
  overlayColor: PropTypes.string,
  overlayHeight: PropTypes.number,
  overlayWidth: PropTypes.number,
  size: PropTypes.oneOf(['small', 'large']),
  startVisible: PropTypes.bool,
  text: PropTypes.string,
  textColor: PropTypes.string,
  textFontSize: PropTypes.number,
  textNumberOfLines: PropTypes.number
};

BusyIndicator.defaultProps = {
  isDismissible: false,
  overlayWidth: 120,
  overlayHeight: 100,
  overlayColor: '#333333',
  color: '#f5f5f5',
  size: 'small',
  startVisible: false,
  text: 'Please wait...',
  textColor: '#f5f5f5',
  textFontSize: 14,
  textNumberOfLines: 1
};

module.exports = BusyIndicator;
```

# Issue (Android)

# Issue (IOS)

# Instructions

- `sudo npm install`
- `react-native eject`
- `react-native link`
- `rn-nodeify --install --hack`
- for reset cache `npm start -- --reset-cache`
