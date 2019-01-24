export default class Singleton {
  static myInstance = null;
  public passcode: string = "";
  
  /**
   * @returns {Singleton}
   */
  static getInstance() {
    if (Singleton.myInstance == null) {
      Singleton.myInstance = new Singleton();
    }
    return this.myInstance;
  }

  getPasscode() {
    return this.passcode;
  }

  setPasscode(code: string) {
    this.passcode = code;
  }    
}   
