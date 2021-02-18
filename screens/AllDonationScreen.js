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
import {ListItem} from 'react-native-elements'

export default class MyDonationScreen extends Component{
    constructor(){
        super()
        this.state={
            userId:firebase.auth().currentUser.email,
            allDonations:[],
            donorName:''
        }
    }

    getUserDetails=()=>{
        db.collection('users').where('email_id','==',this.state.userId).get()
        .then((snapshot)=>{
            snapshot.forEach(doc=>{var document=doc.data();
            this.setState({donorName:document.first_name+" "+document.last_name})})
        })
    }

    getAllDonations=()=>{
        db.collection('all_donations').where('donorId','==', this.state.userId).onSnapshot((snapshot)=>{
            var allDonations=[]
            snapshot.docs.map((doc)=>{var document=doc.data();
            document["doc_id"]=doc.id
            allDonations.push(document)
        })
        this.setState({
            allDonations:allDonations
        })
        })
    }

    sendBook=(item)=>{
      if(item.request_status==="Book Sent"){
        var request_status="Donor Interested"
        db.collection('all_donations').doc(item.doc_id).update({request_status:"Donor Interested"})
        this.sendNotification(item,request_status)
      }

      else{
        var request_status="Book Sent"
        db.collection('all_donations').doc(item.doc_id).update({request_status:"Book Sent"})
        this.sendNotification(item,request_status)
      }
    }

    sendNotification=(item,request_status)=>{
      db.collection('notification').where('request_id','==',item.request_id).where('donorId','==',item.donorId).get()
      .then((snapshot)=>{snapshot.forEach((doc)=>{var document=doc.data()})})
    }


    componentDidMount(){
        this.getAllDonations();
        this.getUserDetails()
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
       style={[styles.button,{backgroundColor:item.request_status=="Book Sent"?"green":"red"}]}
       onPress={()=>{this.sendBook(item)}}
       >
         <Text style={{color:"#fffff"}}>{item.request_status=="Book Sent" ? "Unsend" : "Send Book"}</Text>
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
          this.state.allDonations.length===0?(
            <View>
              <MyHeader title="My Donations" navigation ={this.props.navigation}/>
              <Text>List of allDonations</Text>
            </View>
          ):(
            <View>
              <MyHeader title="MyDonations" navigation ={this.props.navigation}/>
                <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.allDonations}
                renderItem={this.renderItem}
              />
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
