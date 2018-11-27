//Message
var errorMessage = {
    cancel: "CANCEL",
    ok: "OK",
    thanks: "Thanks!!",
    logout_Title: "Logout",
    logout_message: "Are you sure you want to logout?",
    aLERT_Title: "Message",
    aPI_FAILED: "Server not responding, please try after some time.",
    internet_ErrorTitle: "No Internet",
    fAILED_INTERNET: "No internet connection available.",
};




//Validation Message
var errorValidationMessage = {
    enterCode: "Please enter code!",
}

//Colors
var colors = {
    appColor: "#F5951D"
}

var images = {
    appBackgound: require('../../assets/images/icon/mainBackgoundImage.png'),
    paymentScreen: {   
       
    },
}


//Rest Full Api
const domain = "http://localhost:8080/mymoney/api/";
var apiary = {
    urlRegistion: domain + 'registation',
    urlRegistionWithCode: domain + 'registationwithcode',
    urlquestionAndAnswer: domain + 'questionAndAnswer',
};


//Local Database
var localDB = {
    dbName: 'MyMoney.db',
    tableName: {
        tblLogin: 'tblLogin'
    }
}

export {
    errorMessage,
    errorValidationMessage,
    apiary,
    localDB,
    colors,
    images
};