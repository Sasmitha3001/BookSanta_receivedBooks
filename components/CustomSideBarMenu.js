import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { DrawerItems } from 'react-navigation-drawer'
import firebase from 'firebase'
import {Avatar} from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker'
import db from '../config'

export default class CustomSidebarMenu extends Component {
    constructor(){
        super()
        this.state={
            image:'',
            userId:firebase.auth().currentUser.email,
            name:'',
            docId:''
        }
    }
    selectPicture=async()=>{
         const{cancelled,uri}=await ImagePicker.launchImageLibraryAsync({
             mediaTypes:ImagePicker.MediaTypeOptions.All,
             allowsEditing:true,
             aspect:[4,3],
             quality:1
         })   
         if(!cancelled){
             this.setState({
                 image:uri
             })
             this.uploadImage(uri,this.state.userId)
         }
    }
    uploadImage=async(uri,imageName)=>{
        var response=await fetch(uri)
        var blob=await response.blob()
        var ref=firebase.storage().ref().child("user_profiles/"+imageName)
        return ref.put(blob).then(response=>{this.fetchImage(imageName)})
    }

    fetchImage=(imageName)=>{
        var storage=firebase.storage().ref().child("user_profiles/"+imageName)
        storage.getDownloadURL().then((url)=>{this.setState({image:url})}).catch((error)=>{this.setState({image:'#'})})

    }
    componentDidMount(){
        this.getUserDetails()
    }
    getUserDetails=()=>{
        db.collection('users').where("email_id","==",this.state.userId)
        .onSnapshot((snapshot)=>{snapshot.forEach((document)=>{var doc=document.data()
        this.setState({
            name:doc.first_name+" "+doc.last_name,
            docId:doc.id

        })})})
        
    }

    render() {
        return (
            <View
                style={styles.avatar}>
                    <Avatar
                    rounded
                    size="medium"
                    onPress={()=>{this.selectPicture()}}
                    source={{uri:this.state.image}}
                    />
                    <Text>{this.state.name}</Text>
                <View
                    style={styles.drawerItemsContainer}>
                    <DrawerItems
                        {...this.props}
                    />
                </View>
                <View
                    styles={styles.logoutContainer}>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={() => {
                           firebase.auth().signOut() ;
                           this.props.navigation.navigate("WelcomeScreen")
                            
                        }}
                    >
                        <Text style={styles.logOutText}>Log Out</Text>

                    </TouchableOpacity>
                </View>
            </View>

        )
    }
}

var styles = StyleSheet.create({ container: { flex: 1 },
     drawerItemsContainer: { flex: 0.8 },
      logOutContainer: { flex: 0.2, justifyContent: 'flex-end', paddingBottom: 30 },
       logOutButton: { height: 30, width: '100%', justifyContent: 'center', padding: 10 },
        logOutText: { fontSize: 30, fontWeight: 'bold' } ,
        avatar:{flex:1,borderWidth:1}
    })
        
