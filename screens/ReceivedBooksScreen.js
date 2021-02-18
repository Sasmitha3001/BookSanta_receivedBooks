import React,{Component} from 'react'
import {View,Text,FlatList} from 'react-native'
import firebase from 'firebase'
import db from '../config'
import {ListItem} from 'react-native-elements'
import MyHeader from '../components/MyHeader'

export default class ReceivedBooks extends Component{
    constructor(){
        super()
        this.state={
            bookStatus:'',
            userId:firebase.auth().currentUser.email,
            receivedBooks:[],
            bookName:''
        }
    }
  
    getAllReceivedBooks=()=>{
        db.collection('receivedBooks').where('userId','==', this.state.userId).onSnapshot((snapshot)=>{
            var receivedBooks=[]
            snapshot.docs.map((doc)=>{var document=doc.data();
            document["doc_id"]=doc.id
            receivedBooks.push(document)
        })
        this.setState({
            receivedBooks:receivedBooks
        })
        })
    }

    componentDidMount(){
        this.getAllReceivedBooks()
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ( {item, i} ) =>{
      return (
        <View>

       <ListItem
       key={i}
       title={item.bookName}
       subtitle={item.bookStatus}
       titleStyle={{color:"black",fontWeight:"bold"}}
       bottomDivider
       >
  
       </ListItem>
       </View>
      )
    }

    render(){
        return(
        
         this.state.receivedBooks.length===0?(
            <View>
              <MyHeader title="Received Books" navigation ={this.props.navigation}/>
              <Text>List of All Received Books</Text>
            </View>
          ):(
            <View>
              <MyHeader title="Received Books" navigation ={this.props.navigation}/>
                <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.receivedBooks}
                renderItem={this.renderItem}
              />
            </View>
          )
          )
    }

}