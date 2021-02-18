import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer'
import {AppTabNavigator} from './AppTabNavigator'
import CustomSideBarMenu from './CustomSideBarMenu'
import SettingScreen from '../screens/SettingScreen'
import NotificationScreen from '../screens/NotificationScreen';
import MyDonationScreen from '../screens/AllDonationScreen'
import ReceivedBooks from '../screens/ReceivedBooksScreen'
import {Icon} from 'react-native-elements'

export const AppDrawerNavigator=createDrawerNavigator({
    Home: {screen:AppTabNavigator,
    navigationOptions:{drawerIcon:<Icon name='home' type='FontAwesome5'/>}},
    Setting:{screen:SettingScreen, navigationOptions:{drawerIcon:<Icon name="settings" type='Feather'/>}},
    Notification:{screen:NotificationScreen,navigationOptions:{drawerIcon:<Icon name="bell" type='font-awesome'/>}},
    MyDonation:{screen:MyDonationScreen,navigationOptions:{drawerIcon:<Icon name="gift" type='antdesign'/>}},
    ReceivedBooks:{screen:ReceivedBooks,navigationOptions:{drawerIcon:<Icon name="book" type='font-awesome'/>}}
},
{
    contentComponent:CustomSideBarMenu
},
{
    initialRouteName:'Home'
}
)

