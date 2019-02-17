import React, {Component} from 'react';
import {CameraRoll,AppRegistry,Text,View,StyleSheet,AsyncStorage,TextInput,Button,TouchableOpacity} from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-picker';
import RNFS from 'react-native-fs';
const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
      skipBackup: true,
      path: 'images',

    },
  };


/**
 * TODO(developer): Uncomment the following line before running the sample.
 */

  /**
   * The first arg is the options object for customization (it can also be null or omitted for default options),
   * The second arg is the callback which sends object: response (more info in the API Reference)
   */

export default class Home extends Component{
    constructor(props){
        super();
        this.state={
            recipe:'',
            healthLabels:[],
            textValue:'',
            protein:'',
            textValue2:'',
            ingredients:[],
            photos:[]
        }
    }
    getSelectedImages = () =>{

    }
    getRecipe = () => {
        var that = this;
        fetch('https://api.edamam.com/search?q='+this.state.textValue+'&app_id=3a724ce2&app_key=36d51eb5123a3f02711863e497393395').then(response=>response.json()).then(response=>{
                that.setState({textValue:'',recipe:response.hits[0].recipe.label});
                that.setState({ingredients:response.hits[0].recipe.ingredientLines})
                that.setState({healthLabels:response.hits[0].recipe.healthLabels})
                that.setState({protein:response.hits[0].recipe.totalNutrients.PROCNT.quantity})
        });
    }
    picRecipe = (choice) => {
        var that = this;
        fetch('https://api.edamam.com/search?q='+choice+'&app_id=3a724ce2&app_key=36d51eb5123a3f02711863e497393395').then(response=>response.json()).then(response=>{
                that.setState({textValue:'',recipe:response.hits[0].recipe.label});
                that.setState({ingredients:response.hits[0].recipe.ingredientLines})
                that.setState({healthLabels:response.hits[0].recipe.healthLabels})
                that.setState({protein:response.hits[0].recipe.totalNutrients.PROCNT.quantity})
        });
    }
    getRecipe2 = () => {
        var that = this;
        fetch('https://api.edamam.com/search?q=""&nutrients[PROCNT]=0-'+this.state.textValue2+'&app_id=3a724ce2&app_key=36d51eb5123a3f02711863e497393395').then(response=>response.json()).then(response=>{
                that.setState({textValue:'',recipe:response.hits[0].recipe.label});
                that.setState({ingredients:response.hits[0].recipe.ingredientLines})
                that.setState({healthLabels:response.hits[0].recipe.healthLabels})
                that.setState({protein:response.hits[0].recipe.totalNutrients.PROCNT.quantity})
        });
    }

    getPhotos = () => {
        var that = this;
        ImagePicker.launchImageLibrary(options, (response) => {
                const fileName = response.uri;
                RNFS.readFile(fileName, 'base64')
                .then(res =>{
                  console.log(res);
                  var data = res
                  let body = JSON.stringify({
                    requests: [
                      {
                        features: [
                          { type: "LABEL_DETECTION", maxResults: 3 },
                          { type: "LANDMARK_DETECTION", maxResults: 0 },
                          { type: "FACE_DETECTION", maxResults: 0 },
                          { type: "LOGO_DETECTION", maxResults: 0 },
                          { type: "TEXT_DETECTION", maxResults: 0},
                          { type: "DOCUMENT_TEXT_DETECTION", maxResults: 0 },
                          { type: "SAFE_SEARCH_DETECTION", maxResults: 0 },
                          { type: "IMAGE_PROPERTIES", maxResults: 0 },
                          { type: "CROP_HINTS", maxResults: 0 },
                          { type: "WEB_DETECTION", maxResults: 0 }
                        ],
                        image: {
                            content:data
                        }
                      }
                    ]
                  });
                  fetch(
                    "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyB_XOgAqbNTXQfkvS_mNqg4r6ivyDS0sbM",
                    {
                      headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                      },
                      method: "POST",
                      body: body
                    }
                  ).then(res=>res.json()).then(res=>{
                        var array = res['responses'][0].labelAnnotations;
                        
                        var search = ""
                        for(i = 0; i <array.length;i++){
                            search+=' '+array[i].description;
                        }
                        console.warn(search);
                        that.picRecipe(search);
                        
                  });
                });



          });
    }
    render(){
        return(
            <View>

            <Text style={{textAlign:"center", fontWeight:'bold'}}>Welcome to m e a l m a k e r</Text>
            <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                }}
                />
 
            <Button
            title="Find Friends"
            onPress={() => this.props.navigation.navigate('MapScreen')}
              />
        <Button
            title="Choose Photo"
            onPress={this.getPhotos}
              />
              <Text style={{fontWeight:'bold',textAlign:'center'}}>Search By Ingredient</Text>
            <TextInput onChangeText={(value) => this.setState({textValue:value})} value={this.state.textValue} style={{marginLeft:wp(30),textAlign:'center',width:wp(30)}} placeholder="Ingredient?"/>
        <Button onPress={this.getRecipe} title="Submit"></Button>
        <Text style={{fontWeight:'bold',textAlign:'center'}}>Search By Protein</Text>
            <TextInput onChangeText={(value) => this.setState({textValue2:value})} value={this.state.textValue2} style={{marginLeft:wp(30),textAlign:'center',width:wp(30)}} placeholder="Ingredient?"/>
        <Button onPress={this.getRecipe2} title="Submit"></Button>
        <Text style={{fontWeight:'bold',color:'orange',textAlign:'center'}}>{"EAT THIS: "+this.state.recipe}</Text>
        <Text style={{fontWeight:'bold',textAlign:'center'}}>Health Info:</Text>
        {this.state.healthLabels.map((item) =>{
        return(
        <Text style={{fontWeight:'bold',color:'blue',textAlign:'center'}}>{item}</Text>
        );
      })}
      <Text style={{fontWeight:'bold',textAlign:'center'}}>Protein: {this.state.protein}</Text>
      <Text style={{fontWeight:'bold',textAlign:'center'}}>Ingredients:</Text>
        {this.state.ingredients.map((item) =>{
        return(
        <Text style={{fontWeight:'bold',color:'red',textAlign:'center'}}>{item}</Text>
        );
      })}


            </View>
        );

    }


}
AppRegistry.registerComponent('Home',()=>Home);