import * as  React from 'react'
import {Text, View, StyleSheet} from 'react-native'
import firebase from 'firebase'
import db from '../config'
import {Card} from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default class ReceiverDetailsScreen extends React.Component{
    constructor(props){
        super(props)
        this.state={
            userId:firebase.auth().currentUser.email,
            receiverId:this.props.navigation.getParam('Details')["user_id"],
            bookName:this.props.navigation.getParam('Details')["book_name"],
            requestId:this.props.navigation.getParam('Details')['request_id'],
            reasonToRequest:this.props.navigation.getParam('Details')['reason_to_request'],
            receiverName:'',
            receiverContact:'',
            receiverAddress:'',
            receiverRequestDocId:''
        }
    }

    getReceiverDetails=()=>{
        db.collection('users').where('email_id','==', this.state.receiverId).get()
        .then((snapshot)=>{snapshot.forEach(doc=>{var document=doc.data();
        this.setState({
            receiverName:document.first_name,
            receiverConatact:document.contact,
            receiverAddress:document.address
        })})})

        db.collection('requested_books').where('request_id','==',this.state.requestId).get()
        .then((snapshot)=>{snapshot.forEach(x=>{var doc=x.data();
        this.setState({
            receiverRequestDocId:doc.id
        })
        })})
    }

    componentDidMount(){
        this.getReceiverDetails()
    }

    updateBookStatus=()=>{
        db.collection('all_donations').add({
            book_name:this.state.bookName,
            request_id:this.state.requestId,
            requestedBy:this.state.receiverName,
            donorId:this.state.userId,
            request_status:"Donor Interested",

        })
    }

    addNotification=()=>{
        db.collection('notification').add({
            book_name:this.state.bookName,
            request_id:this.state.requestId,
            requestedBy:this.state.receiverName,
            donorId:this.state.userId,
            request_status:"Donor Interested",
            date:firebase.firestore.FieldValue.serverTimestamp(),
            notificationStatus:"unread"
        })
    }

    render(){
        return(
            <View style={styles.container}>
                <Card>
                    <Text style={{fontSize:20,fontWeight:'bold'}}>Receiver Details</Text>
                <Card>
                    <Text>Name:{this.state.receiverName}</Text>
                </Card>

                <Card>
                    <Text>Address:{this.state.receiverAddress}</Text>
                </Card>

                <Card>
                    <Text>contact:{this.state.receiverContact}</Text>
                </Card>

                <Card>
                    <Text>Book Name:{this.state.bookName}</Text>
                </Card>

                <TouchableOpacity style={styles.button}
                onPress={()=>{this.updateBookStatus();this.addNotification();this.props.navigation.navigate('DonateBooks')}}
                >
                    <Text style={styles.buttonText}>I want to Donate</Text>
                </TouchableOpacity>
                </Card>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container:{
     flex:1,
     alignItems: 'center',
     justifyContent: 'center'
   },
   button:{
    width:300,
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:25,
    backgroundColor:"#ff9800",
    shadowColor: "#000",
    marginTop: 15,
    
  },
  buttonText:{
    color:'#ffff',
    fontWeight:'200',
    fontSize:20
  }


})