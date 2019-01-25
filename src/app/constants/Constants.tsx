//Message
var errorMessage = {
  cancel: "CANCEL",
  ok: "OK",
  thanks: "Thanks",
  logout_Title: "Logout",
  logout_message: "Are you sure you want to logout?",
  aLERT_Title: "Message",
  aPI_FAILED: "Server not responding, please try after some time.",
  internet_ErrorTitle: "No Internet",
  fAILED_INTERNET: "No internet connection available."
};

var msg = {
  secretKeyMsg:
    "Scan the above QR or enter the secret manually into your Google Authenticator"
};

//Validation Message
var errorValidationMessage = {
  enterCode: "Please enter code!"
};

//Colors
var colors = {
  appColor: "#F5951D",
  black: "#000000",
  white: "#ffffff",
  Saving: "#E6A620",
  Secure: "#30A2F3",
  placeholder: "#5F5F5F"
};

const assetsImages = "../../assets/images/";

var images = {
  appBackgound: require(assetsImages + "icon/mainBackgoundImage.png"),
  //appBackgound: require(assetsImages + 'icon/slideMenuImage.jpg'),
  appIcon: require(assetsImages + "appLogo.png"),
  slideMenuIcon: require(assetsImages + "icon/slideMenuImage.jpg"),
  onBoardingScreen: {
    onB1: require(assetsImages + "onBoardingScreen/onB1.png"),
    onB2: require(assetsImages + "onBoardingScreen/onB2.png"),
    onB3: require(assetsImages + "onBoardingScreen/onB3.png")
  },
  loginScreen: {
    backgoundImage: require(assetsImages + "loginscreen/loginBackgound.jpg"),
    faceIdImage: require(assetsImages + "loginscreen/faceid.png")
  },
  backupPhraseScreen: {
    backupPhraseLogo: require(assetsImages +
      "backupPhraseScreen/backupPhraseLogo.png")
  },
  verifyBackupPhraseScreen: {
    verifyBackupPhraseLogo: require(assetsImages +
      "verifyBackupPhraseScreen/correctOrder.png")  
  },  
  paymentScreen: {
    cardSideBitcon: require(assetsImages + "paymentScreen/bitcoin1.jpg"),
    cardSideBitcon1: require(assetsImages + "paymentScreen/bitcoin2.png")
  },
  accounts: {
    Savings: require(assetsImages + "accountTypesCard/Savings.png"),
    Secure: require(assetsImages + "accountTypesCard/Secure.png"),
    vault: require(assetsImages + "accountTypesCard/Savings.png"),
    joint: require(assetsImages + "accountTypesCard/Savings.png"),
    unknown: require(assetsImages + "accountTypesCard/Savings.png")
  },
  accountDetailsOnBoarding: {
    secureAccount: {
      img1: require(assetsImages +
        "accountDetailsOnBoarding/secureAccount/secure01.png"),
      img2: require(assetsImages +
        "accountDetailsOnBoarding/secureAccount/secure02.png"),
      img3: require(assetsImages +
        "accountDetailsOnBoarding/secureAccount/secure03.png")
    },
    vaultAccount: {
      img1: require(assetsImages +
        "accountDetailsOnBoarding/vaultAccount/vault01.png"),
      img2: require(assetsImages +
        "accountDetailsOnBoarding/vaultAccount/vault02.png"),
      img3: require(assetsImages +
        "accountDetailsOnBoarding/vaultAccount/vault03.png")
    }
  },
  secureAccount: {
    secureLogo: require(assetsImages + "secureAccount/secureAccountLogo.png"),
    validationKey: require(assetsImages + "secureAccount/validationKey.png")
  }
};

//Rest Full Api
const domain = "https://bh-server-alpha.herokuapp.com/";
var apiary = {
  setup2fa: domain + "setup2fa",
  validate2fasetup: domain + "validate2fasetup",
  urlquestionAndAnswer: domain + "questionAndAnswer"
};

//Local Database
var localDB = {
  dbName: "MyMoney.db",
  tableName: {
    tblUser: "tblUser",
    tblWallet: "tblWallet",
    tblAccountType: "tblAccountType",
    tblAccount: "tblAccount",
    tblTransaction: "tblTransaction"
  }
};

var notification = {
  notifi_UserDetialsChange: "notifi_UserDetialsChange"
};

export {
  errorMessage,
  errorValidationMessage,
  msg,
  apiary,
  localDB,
  colors,
  images,
  notification
};
