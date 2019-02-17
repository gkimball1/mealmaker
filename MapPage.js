import React, {Component} from 'react';
import {AppRegistry,Text,View,StyleSheet,AsyncStorage,TextInput,Button,TouchableOpacity} from 'react-native'
import Map from './Map'

export default class MapPage extends Component{

    render(){
        return(
            <View>
            <Text style={{textAlign:"center", fontWeight:'bold'}}>Your Friends and their Locations!</Text>
            <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                }}
                />


            </View>
        );

    }


}
AppRegistry.registerComponent('MapPage',()=>MapPage);