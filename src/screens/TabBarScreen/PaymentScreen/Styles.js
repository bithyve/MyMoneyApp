import { StyleSheet, Dimensions } from 'react-native';

//TODO: Custome Pages
import { colors, images } from "../../../constants/Constants";

const { width, height } = Dimensions.get('window')

export default {
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    rkCard: {
        height: 170,
        width: '99%',
        alignSelf: 'center',

    },
    cardBackImage: {
        borderRadius: 10,
    },
    //TODO: CARD
    cardText: {
        color: '#ffffff'
    },
    cardTitle: {
        fontSize: 25
    },
    cardType: {
        marginTop: 60
    },
    cardAmount: {
        fontSize: 20
    },
    paginationContainer:{
        marginTop: -20,
        marginBottom: -35,
    },
    //Amount Infomation
    viewAmountInfo: {
        paddingTop: 20,
        paddingLeft: 50,
    },
    viewAmountSingleLine: {
        flexDirection: 'row',
    },
    txtAmountTitle: {
        color: "#ffffff"
    },
    txtAmount: {
        fontWeight: 'bold'
    },
    //Recent Transaction
    viewTitleRecentTrans: {
        marginLeft: 20,
    },
    txtRecentTran: {
        fontWeight: 'bold',
        fontSize: 25
    }, 
    txtTransTitle:{
        fontWeight:'bold'
    },   
    txtAmoundRec: {
        color: "#228B22",
        fontWeight:'bold'
    },   
    txtAmoundSent:{
        color:"red",
        fontWeight:'bold'
    },
    //Account Type Popup Account
    viewPopUpAccountType:{
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',  
        marginBottom: 10,
    },
    btnPopupAccountAddIcon:{
        height:60,
        width:60,
        borderRadius:30,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor:colors.appColor
    }, 
    //Account list
    viewPopUpAccountList:{
        alignItems: 'center'
    }  

}   