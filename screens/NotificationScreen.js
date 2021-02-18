import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import SwipeableFlatList from '../components/SwipeableFlatList';
import {ListItem} from 'react-native-elements'
export default class NotificationScreen extends Component{
    constructor(){
        super()
        this.state={
            userId:firebase.auth().currentUser.email,
            allNotification:[]
        }
    }

    getNotifications=()=>{
        db.collection('notification').where('notifications_status','==','unread')
        .where('donorId','==',this.state.userId)
        .onSnapshot((snapshot)=>{
            var allNotification=[]
            snapshot.docs.map((doc)=>{var document=doc.data();
            document["doc_id"]=doc.id
            allNotification.push(document)
        })
        this.setState({
           allNotification:allNotification
        })
        })
    }

    componentDidMount(){
        this.getNotifications()
    }

    keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>{
    return (
      <View>
    <Text>{item.book_name}</Text>
     <ListItem
     key={i}
     title={item.book_name}
     subtitle={"Requested By: " +item.requestedBy}
     titleStyle={{color:"black",fontWeight:"bold"}}
     rightElement={
       <TouchableOpacity
       style={styles.button}
       >
         <Text style={{color:"green"}}>Send Book</Text>
       </TouchableOpacity>
     }
     bottomDivider
     >

     </ListItem>
     </View>
    )
  }
    render(){
        return(
          this.state.allNotification.length===0?(
            <View>
 <MyHeader 
              title="Notification Screen"
              navigation={this.props.navigation}
              />
              <Text>List of All Notifications</Text>
            </View>
          ):(
            <View>
               <MyHeader 
              title="Notification Screen"
              navigation={this.props.navigation}
              />
              <FlatList
              data={this.state.allNotification}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}/>
                {/* <SwipeableFlatList 
              allNotifications={this.state.allNotification}/>
              */}
 
            </View>
          )
        )
    }
}

const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 100,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#32867d",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },
  view: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
