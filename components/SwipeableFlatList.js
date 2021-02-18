import React from 'react';
import { Dimensions,Animated, StyleSheet } from 'react-native';
import { ListItem,Icon } from 'react-native-elements';
import {SwipeListView} from 'react-native-swipe-list-view'
import {View,Text} from 'react-native'

export default class SwipeableFlatList extends React.Component{
    constructor(props){
        super(props)
        this.state={
            allNotifications:this.props.allNotifications,

        }
    }

    renderItem=(data)=>{
        <Animated.View>
            <ListItem
            leftElement={<Icon name="book" type="font-awesome" color="red"/>}
            title={data.item.book_name}
            titleStyle={{color:"black",fontWeight:'black'}}
            bottomDivider
            />
        </Animated.View>
    }

    renderHiddenItem=()=>{
        <View style={styles.rowBack}>
            <View style={styles.backRightButton}>
                <Text>Clear <Icon name="trash-2" type="feather"/></Text>
            </View>
        </View>
    }

    onSwipeValueChange=(swipeData)=>{
        var allNotifications=this.state.allNotifications
        const {key,value}=swipeData

        if(value<-Dimensions.get('window').width){
            const newData=[...allNotifications]
            const prevIndex=allNotifications.findIndex(item=>{item.key===key})
                this.updateMarkAsRead(allNotifications[prevIndex])
                newData.splice(prevIndex,1)
                this.setState({
                    allNotifications:newData
                })

            }
    }
    updateMarkAsRead=(notification)=>{
        db.collection('notification').doc(notification.doc_id).update({notificationStatus:"Read"})
    }



    render(){
        return(
        <View style={styles.container}>

            <SwipeListView
            disableRightSwipe
            data={this.state.allNotifications}
            renderItem={this.renderItem}
            renderHiddenItem={this.renderHiddenItem}
            rightOpenValue={-Dimensions.get('window').width}
            previewRowKey={'0'}
            previewOpenValue={-40}
            previewOpenDelay={3000}
            onSwipeValueChange={this.onSwipeValueChange}
            keyExtractor={(item,index)=>{index.toString()}}
            />

        </View>
        )
    }
}
const styles=StyleSheet.create({
    container:{
        backgroundColor:'white',
        flex:1
    },
    rowBack: {
        alignItems: "center",
        backgroundColor: "#29b6f6",
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 15
      },
      backRightBtn: {
        alignItems: "center",
        bottom: 0,
        justifyContent: "center",
        position: "absolute",
        top: 0,
        width: 100
      },
    
})