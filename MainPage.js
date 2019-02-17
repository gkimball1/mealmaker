import React, {Component} from 'react';
import {Alert,AppRegistry,Text,View,StyleSheet,AsyncStorage,TextInput,Button,TouchableOpacity} from 'react-native'
import MapView from 'react-native-maps'
import {Provider} from 'react-redux'
import * as firebase from 'firebase'
import RNRestart from 'react-native-restart';
import MapPage from './MapPage';
import Collapsible from 'react-native-collapsible';
import Map from './Map';
import geolib from 'geolib';
import Geocoder from 'react-native-geocoding';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
Geocoder.init('AIzaSyB_XOgAqbNTXQfkvS_mNqg4r6ivyDS0sbM');
var config = {
  apiKey: "AIzaSyAj0WvbLYPJlEueIalPKNw5SsI70GltIDk",
  authDomain: "react-firebase-490bc.firebaseapp.com",
  databaseURL: "https://react-firebase-490bc.firebaseio.com",
  projectId: "react-firebase-490bc",
  storageBucket: "react-firebase-490bc.appspot.com",
  messagingSenderId: "895709839129"
};
firebase.initializeApp(config);
var nameDict = {name:''}
var name = ''
export default class myapp extends Component{
  constructor(props){
    super();
    this.state ={
      addFriends:true,
      friendText:'none',
      userInfo:true,
      searchToggle:true,
      listViewShow:false,
      counter:'',
      count:0,
      showFriends:true,
      lastSearch:'',
      mapKey:0,
      friends:[],
      searchPlace:'',
      ID:'',
      name:'',
      name2:'',
      textValue:'',
      textValue2:'',
      searchVal:{
          latitude:10000,
          longitude:10000
      },
      userPosition:{
        latitude:36.8,
        longitude:-122
      },
      markers: [

      ]

    }
  }

componentDidMount(){
    var that = this;

    this.watchId = navigator.geolocation.watchPosition((position)=>{
      if(that.state.friends.length > 0){
        that.setState({friendText:'flex'})
      }else{
        that.setState({friendText:'none'})
      }
      var friends = [];
      AsyncStorage.getItem('name').then((value)=>{
        this.setState({name2:value});
        var query2 = firebase.database().ref('/users/'+this.state.name2).orderByKey();
        query2.once("value")
          .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
              var value = childSnapshot.val();
              friends.push(value.userId);
          });
        });
    });
      AsyncStorage.getItem('ID').then((value)=>{this.setState({ID:value})});

      if(this.state.name2 !== '' && this.state.name2 !==null){
        

      }
      var lat = position.coords.latitude
      var long = position.coords.longitude
      name = this.state.name2
      var id = name
      var noData = false
      if(id === '' || id===null){
        noData = true
      }
      if(noData){
        firebase.database().ref('/positions').child("Bob").set({watchId:'',latitude:lat,longitude:long});
      }else{
        firebase.database().ref('/positions').child(id).set({watchId:this.state.ID,latitude:lat,longitude:long});
      }
      
      this.setState({userPosition:{latitude:lat,longitude:long}});
      var found = false
      var found2 = false
      var query = firebase.database().ref("/positions").orderByKey();
      query.once("value")
        .then(function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            var isThere = (friends.indexOf(childData.watchId) > -1);
            if(isThere){
              found = false;
              that.setState({friends: that.state.friends.map(friend =>{
                
                if(friend.userId === childData.watchId){
                  found = true;
                  friend.name = key;
                }
                return friend;
              })});
              if(found === false && isThere){
                var joine = that.state.friends.concat({userId:childData.watchId,name:key});
                that.setState({friends: joine});
              }
              found2 = false;
              that.setState({markers: that.state.markers.map(marker =>{
                if(marker.watchId === key){
                  found2=true
                  marker.latitude = childData.latitude
                  marker.longitude = childData.longitude
                }
                
                return marker;
              })});
              if(found2 === false){
                var joined = that.state.markers.concat({watchId:key,latitude:childData.latitude,longitude:
                childData.longitude})
                that.setState({markers: joined});
              }
            }

        });
      });

      },null,{timeout:0,distanceFilter:0})
}
onChangeText(value){
  this.setState({textValue:value});
}

onSubmit = async () => {
   var data = this.state.textValue;
   nameDict['name'] = data;
   //this.setState({textValue:'',name:data})
   var func = require('./Helper');
   this.setState({textValue:''});
   var id_val = func(6);
   AsyncStorage.setItem('ID',id_val);
   AsyncStorage.setItem('name',data);
  
}
deleteFriend = (friend) => {
  var data = friend.userId;
  var func = require('./Helper');
  var that = this;
  this.setState({'mapKey':func(6)});
  this.setState({friends:this.state.friends.map(friendo =>{
    if(friendo.userId === data){
      friendo.userId = '';
      friendo.name = '';
    }
    return friendo;
  })});
  nameOfDelete = '';
  var query = firebase.database().ref("/positions").orderByKey();
  query.once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var key = childSnapshot.key;
        var childData = childSnapshot.val();
        if(childData.watchId === data){
          nameOfDelete = key;
        }


    });
    that.setState({markers:that.state.markers.map(marker =>{
      if(marker.watchId === nameOfDelete){
        marker.longitude = 10000000;
        marker.latitude = 100000000;
        marker.watchId = 'No Name';
      }
      return marker;
      
    })});
    
  });
  var ref = firebase.database().ref('/users').child(this.state.name2).child(data);
  ref.remove();

}
onSubmit2 = async() =>{
  var data = this.state.textValue2;
  firebase.database().ref('/users').child(this.state.name2).child(data).set({userId:data});
  this.setState({textValue2:''});
  var joined = this.state.friends.concat({name:'',userId:data})
  this.setState({friends:joined});
}
addWaitData = (data,time) =>{
  var id = this.state.name2;
  var updatedObj = {};
  updatedObj[id] = time;
  firebase.database().ref('/places').child(data).set(updatedObj);
}
onSubmit3 = async(dataObj) =>{
    var data = dataObj.description;
    this.setState({count:0})
    this.setState({listViewShow:!this.state.listViewShow})
    var that = this;
    var func = require('./distHelper');
    var savedLoc = null;
    var count = 0;
    Alert.alert(
      data.split(',')[0],
      'How long do you usually wait here?',
      [
        {text: '0-15 mins', onPress: () => this.addWaitData(data,15)},
        {
          text: '15-30 mins',
          onPress: () => this.addWaitData(data,30),
          style: 'cancel',
        },
        {text: '>30 minutes', onPress: () => this.addWaitData(data,45)},
      ],
      {cancelable: false},
    );
    Geocoder.from(data)
    .then(json => {
        var location = json.results[0].geometry.location;
        savedLoc = location;
        that.setState({searchVal:{latitude:location.lat,longitude:location.lng}});
        that.setState({lastSearch:data.split(',')[0]});
        that.setState({searchPlace:''});
        var query = firebase.database().ref("/positions");
        query.once("value")
          .then(function(snapshot){
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();
                var dist = geolib.getDistance(that.state.searchVal,{latitude:childData.latitude,longitude:childData.longitude}) //func(savedLoc.lat,savedLoc.lng,childData.latitude,childData.longitude,'M');
                if(Math.floor(dist) < 30){
                  that.setState({count:that.state.count+1})
                }
          })
          if(that.state.count > 40){
            that.setState({counter:'Crowded('+that.state.count+' people there)'});
          }else if(that.state.count > 20){
            that.setState({counter:'Relatively Crowded('+that.state.count+' people there)'});
          }else{
            that.setState({counter:'Not Crowded('+that.state.count+' people there)'});
          }
        });

    })
    .catch(error => console.warn(error));

  }

  render(){
    return(
      <View style={{backgroundColor:'white'}}>
      {/* 
        <View style={{flexDirection:'row',marginLeft:wp(10)}}>
        <Text style={{marginTop:hp(1),marginRight:wp(2),fontWeight:'bold'}}>Search:</Text>
        <TextInput onChangeText={(value) => this.setState({searchPlace:value})} value={this.state.searchPlace} style={{width:85}} placeholder="Enter Location"/>

        <Button onPress={this.onSubmit3} title="Submit"></Button>  
        </View>
      */}
      <TouchableOpacity
         style={styles.button2}
         onPress={() => this.setState({listViewShow:!this.state.listViewShow})}
       >
         <Text style={{fontWeight:'bold'}}> Search a Place </Text>
       </TouchableOpacity>
      <Collapsible collapsed={!this.state.listViewShow}>
      <View style={{flexDirection:'row'}}>
      <GooglePlacesAutocomplete
                  ref="endlocation"
                  placeholder='Where do you want to go?'
                  minLength={2} 
                  returnKeyType={'search'} 
                  listViewDisplayed={this.listViewShow}
                  fetchDetails={true}      
                  query={{
                    key:'AIzaSyB_XOgAqbNTXQfkvS_mNqg4r6ivyDS0sbM',
                    language: 'en', 
                  }}
                  onPress={(data, details = null) => this.onSubmit3(data)}
                  styles={{
                    textInputContainer: {
                      width: '100%',
                      backgroundColor: '#FFF',
                      marginBottom:hp(10)
                    },
                    listView: {
                      backgroundColor: '#F0F0F0',
                      position: 'absolute',
                      height: hp(100),
                      marginTop:hp(4),
                      width: wp(100),
                    }
                  }}
                  debounce={200} 
                />
      </View>
      </Collapsible>
      <Collapsible collapsed={this.state.listViewShow}>
        <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                }}
        /> 
        
        <TouchableOpacity
         style={styles.button3}
         onPress={() => this.setState({userInfo:!this.state.userInfo})}
       >
         <Text style={{fontWeight:'bold'}}> Toggle User Info </Text>
       </TouchableOpacity>
       <Collapsible collapsed={this.state.userInfo}>
       <View style={{flexDirection:'row',marginLeft:wp(10)}}>
        <Text style={{fontWeight:'bold',marginRight:wp(2),marginTop:hp(1)}}>Enter Your Name:</Text>
        <TextInput onChangeText={(value) => this.onChangeText(value)} value={this.state.textValue} style={{width:wp(30)}} placeholder="Enter Name"/>
        <Button onPress={this.onSubmit} title="Submit"></Button>
        </View>
        <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                }}
                />
        <Text style={{fontWeight:'bold',color:'blue',textAlign:'center'}}>Your name is: {this.state.name2}</Text>
        <Text style={{fontWeight:'bold',color:'blue',textAlign:'center'}}>Your ID: {this.state.ID}</Text>
        <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                }}
                />
        </Collapsible>
        <TouchableOpacity
         style={styles.button4}
         onPress={() => this.setState({addFriends:!this.state.addFriends})}
       >
         <Text style={{fontWeight:'bold'}}> Add Friends </Text>
       </TouchableOpacity>
       <Collapsible collapsed={this.state.addFriends}>
        <View style={{flexDirection:'row',marginLeft:wp(10)}}>

        <Text style={{marginTop:hp(1),marginBottom:hp(1),marginRight:wp(2),fontWeight:'bold'}}>Add Friends:</Text>
        <TextInput onChangeText={(value) => this.setState({textValue2:value})} value={this.state.textValue2} style={{width:wp(30)}} placeholder="Enter Friend ID" required/>
        <Button onPress={this.onSubmit2} title="Submit"></Button>
        </View>
        <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                }}
          />
          </Collapsible>
       <TouchableOpacity
         style={styles.button}
         onPress={() => this.setState({showFriends:!this.state.showFriends})}
       >
         <Text style={{fontWeight:'bold'}}> Toggle Friend List </Text>
       </TouchableOpacity>
       <Collapsible collapsed={this.state.showFriends}>
      <Text style={{marginTop:hp(1),marginBottom:hp(1),textAlign:'center',fontWeight:'bold'}}>Your Friends</Text>
      <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                }}
          />
      <View style={{textAlign:'center'}}>
      <Text style={{fontWeight:'bold',textAlign:'center',display:this.state.friendText}}>No Friends Added</Text>
      {this.state.friends.map((friend,i) =>{
        return(
          <TouchableOpacity onPress={() => this.deleteFriend(friend)} style={{height:hp(3) }}>
                <Text style={{fontWeight:'bold',color:'red',textAlign:'center'}}>{friend.name}</Text>
        </TouchableOpacity>
        );
      })}
      </View>
      </Collapsible>
     <Collapsible collapsed={!this.state.showFriends}>
     <Text style={{marginTop:hp(1),marginBottom:hp(1),textAlign:'center',fontWeight:'bold'}}>Map:</Text>
      <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                }}
          />
      <Map count={this.state.counter} markers={this.state.markers} searchPlace={this.state.lastSearch} searchVal={this.state.searchVal} userPosition={this.state.userPosition} mapKey={this.state.mapKey}></Map>
      </Collapsible>
      </Collapsible>
      </View>
      
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    backgroundColor:'blue',
    fontWeight:'bold'
  },
  button2: {
    alignItems: 'center',
    padding: 10,
    backgroundColor:'red',
    fontWeight:'bold'
  },
  button3: {
    alignItems: 'center',
    padding: 10,
    backgroundColor:'green',
    fontWeight:'bold'
  },
  button4: {
    alignItems: 'center',
    padding: 10,
    backgroundColor:'orange',
    fontWeight:'bold'
  },
  countContainer: {
    alignItems: 'center',
    padding: 10
  },
  countText: {
    color: '#FF00FF'
  }
})
AppRegistry.registerComponent('myapp',()=>myapp);