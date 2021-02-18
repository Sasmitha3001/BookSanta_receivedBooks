import React, { Component} from 'react';
import { Header,Icon,Badge } from 'react-native-elements';
import { View, Text, StyleSheet ,Alert} from 'react-native';
import db from '../config'

export default class MyHeader extends Component {

  constructor(){
    super()
    this.state={
      value:'',
    }
  }

  getNumberOfUnreadNotifications=()=>{
    db.collection("notification").where("notificationStatus",'==','unread').onSnapshot((snapshot)=>{
      var unreadNotification=snapshot.docs.map((doc)=>{var document=doc.data();
      })
      this.setState({
        value:unreadNotification.length
      })
    })
  }

  componentDidMount(){
    this.getNumberOfUnreadNotifications()
  }
  render(){
    return (
      <Header
        leftComponent={<Icon 
        name="bars"
        type="font-awesome"
        color="black"
        onPress={()=>{this.props.navigation.toggleDrawer()}}
        />}
        centerComponent={{ text: this.props.title, style: { color: '#90A5A9', fontSize:20,fontWeight:"bold", } }}
        rightComponent={<View>
          <Icon
        name="bell"
        type="font-awesome"
        color="black"
        size={25}
        onPress={()=>{this.props.navigation.navigate('Notification')}}
        /> 
      <Badge
      value={this.state.value}
      containerStyle={{position:'absolute', top:-4,right:-4}}
      />
        </View>
      }
  
        backgroundColor = "#eaf8fe"
      />
    );
  }
  
};


