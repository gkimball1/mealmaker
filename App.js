import React, {Component} from 'react';
import {AppRegistry,Text,View,StyleSheet,AsyncStorage,TextInput,Button,TouchableOpacity} from 'react-native'
import MainNavigator from './Navigator'

export default class Home extends Component{

    render(){
        return(
            <MainNavigator/>
        );

    }


}
AppRegistry.registerComponent('Home',()=>Home);


