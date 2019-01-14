export default class Singleton {
  static myInstance = null;
  userDetails = [];
  static getInstance() {
    if (Singleton.myInstance == null) {
      Singleton.myInstance = new Singleton();
    }

    return this.myInstance;
  }

  //UserDetails
  setUserID(id) {
    this.userDetails = id;
  }
  getUserID() {
    return this.userDetails;
  }


//call function
// import CommonDataManager from './CommonDataManager';
// // When storing data.
// let commonData = CommonDataManager.getInstance();
// commonData.setUserID("User1");
// // When retrieving stored data.
// let commonData = CommonDataManager.getInstance();
// let userId = commonData.getUserID();
// console.log(userId);
 




}
