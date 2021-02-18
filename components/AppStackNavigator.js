import React from 'react';
import { Image } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import BookDonateScreen from '../screens/BookDonateScreen';
import ReceiverDetailsScreen from '../screens/ReceiverDetailsScreen';



export const AppStackNavigator = createStackNavigator({
  DonateBooks : {
    screen: BookDonateScreen,
    
  },
  ReceiverDetails: {
    screen: ReceiverDetailsScreen,
   
  }
}, {initialRouteName:'DonateBooks'});
