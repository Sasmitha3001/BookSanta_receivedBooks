import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import {BookSearch} from 'react-native-google-books'
import { FlatList, TouchableHighlight } from 'react-native-gesture-handler';

export default class BookRequestScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      bookName:"",
      reasonToRequest:"",
      isBookRequestActive:'',
      userDocId:'',
      dataSource:'',
      showFlatList:false,
      requestedBookName:'',
      request_id:'',
      docId:''
    }
  }
  componentDidMount(){
    this.isBookRequestActive()
    this.getBookName()
  }

  isBookRequestActive=()=>{
    db.collection('users').where('email_id','==',this.state.userId)
    .onSnapshot((snapshot)=>{snapshot.forEach(doc=>{var document=doc.data();
    this.setState({
      isBookRequestActive:document.isBookRequestActive,
      userDocId:document.id
    })})})
    console.log(this.state.isBookRequestActive)
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }

getBooksFromApi=async(bookName)=>{
    this.setState({
      bookName:bookName
    })
    if(bookName.length>2){
      var books=await BookSearch.searchbook(bookName,'AIzaSyDv7lKU1POUjtLovTLXgj8nya9yKshPb-Q')
      this.setState({
        dataSource:books.data,
        showFlatList:true
      })
    }
   }

   renderItem=({item,i})=>{
    return(
      <TouchableHighlight
      style={{alignItem:'center',
      backgroundColor:'#DDDDDD',
      padding:10,
      width:'90%'
      }}
      activeOpacity={0.6}
      underlayColor="white"
      onPress={()=>{this.setState({showFlatList:false,bookName:item.volumeInfo.title})}}
      bottomDivider
      >
        <Text>{item.volumeInfo.title}</Text>
      </TouchableHighlight>
    )
   }

  addRequest=(bookName,reasonToRequest)=>{
   var userId=this.state.userId
   var randomRequestId=this.createUniqueId()
   db.collection('requested_books').add({
     'user_id':userId,
     'book_name':bookName,
     'reason_to_request':reasonToRequest,
     'request_id':randomRequestId,
     'book_status':'requested'
   })

   db.collection('users').where('email_id','==',this.state.userId).get()
   .then(snapshot=>{snapshot.forEach((doc)=>{var document=doc.data();
   db.collection('users').doc(doc.id).update({
     isBookRequestActive:true
   })})})
   this.setState({
     bookName:"",
     reasonToRequest:""
   })

   return(
     Alert.alert("Book Requested Successfully")
   )
  }

  updateBookRequestStatus=()=>{
    // db.collection('requested_books').where('book_name','==',this.state.requestedBookName).get()
    // .then(snapshot=>{snapshot.forEach((doc)=>{var document=doc.data();
    // this.setState({bookStatus:document.book_status})}
    // )})
    db.collection('requested_books').doc(this.state.docId).update({book_status:'received'})
    db.collection('users').where('email_id','==',this.state.userId).get()
    .then(snapshot=>{snapshot.forEach((doc)=>{var document=doc.data();
    db.collection('users').doc(doc.id).update({
      isBookRequestActive:false
    })})})

  }

  getBookName=()=>{
    db.collection('requested_books').where('user_id','==',this.state.userId)
    .onSnapshot((snapshot)=>{snapshot.forEach(doc=>{var document=doc.data();
      if(document.book_status!=="received"){
    this.setState({
      requestedBookName:document.book_name,
      docId:doc.id
    })
  }})})


  }

receivedBooks=(bookName)=>{
  db.collection('receivedBooks').add({
    userId:this.state.userId,
    bookName:bookName,
    request_id:this.state.request_id,
    bookStatus:'received'
  })
}


  render(){
   
    return(
      this.state.isBookRequestActive===false?(<View style={{flex:1}}>
        <MyHeader title="Request Book" navigation ={this.props.navigation}/>
          <KeyboardAvoidingView style={styles.keyBoardStyle}>
            <TextInput
              style ={styles.formTextInput}
              placeholder={"enter book name"}
              onChangeText={(text)=>{
                  this.getBooksFromApi(text)
              }}
              onClear={(text)=>{
                this.getBooksFromApi('')
              }}
              value={this.state.bookName}
            />
            {this.state.showFlatList ?(<FlatList 
            data={this.state.dataSource}
            renderItem={this.renderItem}
            enableEmptySections={true}
            style={{margnTop:10}}
            keyExtractor={(item,index)=>{index.toString()}}
            />):(
              <View>
                <TextInput
              style ={[styles.formTextInput,{height:300}]}
              multiline
              numberOfLines ={8}
              placeholder={"Why do you need the book"}
              onChangeText ={(text)=>{
                  this.setState({
                      reasonToRequest:text
                  })
              }}
              value ={this.state.reasonToRequest}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={()=>{this.addRequest(this.state.bookName,this.state.reasonToRequest)}}
              >
              <Text>Request</Text>
            </TouchableOpacity>
              </View>
            )}
            
          </KeyboardAvoidingView>
      </View>):(
        <View style = {{flex:1,justifyContent:'center'}}>
          <MyHeader 
          title="Book Request Screen"
          navigation={this.props.navigation}
          />
        <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text>Book Name:{this.state.requestedBookName}</Text>
          <Text>Book Status:Requested</Text>
 
          <TouchableOpacity 
          style={{backgroundColor:'orange', width:300,height:30, alignSelf:'center'}}
          onPress={()=>{this.updateBookRequestStatus();this.receivedBooks(this.state.requestedBookName)}}>
            <Text>I Received the Book </Text>
          </TouchableOpacity>
        </View>
        </View>
      )
        
    )
  }

  }


const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)
