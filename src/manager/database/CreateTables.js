import React, { Component } from "react";
import SQLite from "react-native-sqlite-storage";
import { localDB } from "../../constants/Constants";

export default class CreateTables extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var db = SQLite.openDatabase(
      { name: localDB.dbName, readOnly: true },
      this.openCB,
      this.errorCB
    );

    db.transaction(function(txn) {
      //TODO: TABLE
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
          localDB.tableName.tblUser +
          " (id  INTEGER PRIMARY KEY AUTOINCREMENT,dateCreated TEXT,firstName TEXT,lastName TEXT,email TEXT,country TEXT,mobileNo TEXT,lastUpdated TEXT)",
        []
      );
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
          localDB.tableName.tblWallet +
          " (id  INTEGER PRIMARY KEY AUTOINCREMENT,dateCreated TEXT,mnemonic TEXT,privateKey TEXT,address TEXT,walletType TEXT,lastUpdated TEXT)",
        []
      );
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
          localDB.tableName.tblAccountType +
          " (id  INTEGER PRIMARY KEY AUTOINCREMENT,dateCreated TEXT,name TEXT,lastUpdated TEXT)",
        []
      );
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
          localDB.tableName.tblAccount +
          " (id  INTEGER PRIMARY KEY AUTOINCREMENT,dateCreated TEXT,address TEXT,balance TEXT,unit TEXT,accountType TEXT,additionalInfo TEXT,lastUpdated TEXT,FOREIGN KEY(accountType) REFERENCES tblAccountType(name))",
        []
      );
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
          localDB.tableName.tblTransaction +
          " (id  INTEGER PRIMARY KEY AUTOINCREMENT,dateCreated TEXT,accountAddress TEXT,transactionHash TEXT,balance INTEGER,unit TEXT,fees INTEGER,transactionType TEXT,confirmationType TEXT,lastUpdated TEXT,FOREIGN KEY(accountAddress) REFERENCES tblAccount(address))",
        []
      );
      //TODO: TRIGGER;
      // txn.executeSql(
      //   "CREATE TRIGGER insertLastBeforetblAccount BEFORE INSERT ON tblAccount  BEGIN SELECT * FROM tblAccount where accountType = 'UnKnown'  THEN RAISE (ABORT,'Invalid email address')END;END;",
      //   []
      // );  
      console.log("create database.");
    });
  }
  
  errorCB(err) {
    console.log("SQL Error: " + err);
  }

  successCB() {
    console.log("SQL executed fine");
  }

  openCB() {
    console.log("Database OPENED");
  }

  render() {
    return null;
  }
}
