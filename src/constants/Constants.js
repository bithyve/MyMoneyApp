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
    appColor: "#F5951D",
    black: "#000000"
}

const assetsImages = '../assets/images/';

var images = {
    appBackgound: require(assetsImages + 'icon/mainBackgoundImage.png'),
    appIcon: require(assetsImages + 'appLogo.png'),
    onBoardingScreen: {
        cardSideBitcon: require(assetsImages + 'onBoardingScreen/bitcoin.png'),
        cardSideBitcon1: require(assetsImages + 'onBoardingScreen/bitcoin1.png')
    },
    loginScreen: {
        backgoundImage: require(assetsImages + 'loginscreen/loginBackgound.jpg'),
        faceIdImage: require(assetsImages + 'loginscreen/faceid.png'),
    },
    backupPhraseScreen: {
        backupPhraseLogo: require(assetsImages + 'backupPhraseScreen/backupPhraseLogo.png'),
    },
    verifyBackupPhraseScreen: {
        verifyBackupPhraseLogo: require(assetsImages + 'verifyBackupPhraseScreen/correctOrder.png'),
    },
    paymentScreen: {
        cardSideBitcon: require(assetsImages + 'paymentScreen/bitcoin1.jpg'),
        cardSideBitcon1: require(assetsImages + 'paymentScreen/bitcoin2.png')
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
        tblUserDetials: 'tblUserDetails',
        tblWallets: 'tblWallets'
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