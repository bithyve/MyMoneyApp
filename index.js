/** @format */

import {AppRegistry} from 'react-native';
require('node-libs-react-native/globals');
import App from './App';
import './shim';                
import {name as appName} from './app.json';              
AppRegistry.registerComponent(appName, () => App);  
     