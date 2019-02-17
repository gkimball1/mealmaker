import React, {Component} from 'react';
import {AppRegistry,Text,View,StyleSheet,AsyncStorage,TextInput,Button,TouchableOpacity} from 'react-native'
import MapView from 'react-native-maps'
import {Provider} from 'react-redux'
import * as firebase from 'firebase'
import RNRestart from 'react-native-restart';

export default class Map extends Component{
    constructor(props){
        super(props);
        this.state = {userChange:'',opacity:1.0}
    }
    componentDidMount(){
        var ref = firebase.database().ref("/users");
        var that = this;
        // Get the data on a post that has been removed
        ref.on("child_removed", function(snapshot) {
            setTimeout(that.setState({userChange:'user was deleted!'}),
                2000
            );
            //that.forceUpdate();
        });
    }
    render(){
        return(
            <View>
            <Text>{this.state.userChange}</Text>
            <MapView key={this.props.mapKey} style={{height:450,width:350,marginTop:5,alignSelf:'center'}}
            showsUserLocation={true}
            followsUserLocation={true}
            showsMyLocationButton={true}
            region = {this.state.searchVal}
            >
              <MapView.Marker
                      coordinate={this.props.userPosition}
                      title={"Your Current Position"}
                      description={"description ey"}
          
                />
                <MapView.Marker
                      coordinate={this.props.searchVal}
                      title={this.props.searchPlace}
                      description={this.props.count}
          
                />
            {this.props.markers.map(marker =>{
              return(
                      <MapView.Marker 
                      opacity={this.state.opacity}
                      coordinate={{latitude:marker.latitude,longitude:marker.longitude}}
                      title={marker.watchId}
                      description={"description ey"}
          
                   />
              );
            })}
        
        
            </MapView>
            </View>
        );

    }


}
AppRegistry.registerComponent('Map',()=>Map);

