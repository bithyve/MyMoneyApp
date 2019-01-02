import React, { Component } from "react";
import RNFS from "react-native-fs";
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

    
    db.transaction(function (txn) {
      //txn.executeSql('DROP TABLE IF EXISTS ' + localDB.tableName.tblLogin, []);
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
        localDB.tableName.tblUser +
        " (id  INTEGER PRIMARY KEY AUTOINCREMENT,dateCreated TEXT,firstName TEXT,lastName TEXT,email TEXT,country TEXT,mobileNo TEXT,lastUpdated TEXT)",
        []
      );
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
        localDB.tableName.tblWallet +
        " (id  INTEGER PRIMARY KEY AUTOINCREMENT,dateCreated TEXT,mnemonic TEXT,privateKey TEXT,address TEXT,lastUpdated TEXT)",
        []
      );
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
        localDB.tableName.tblAccount +
        " (id  INTEGER PRIMARY KEY AUTOINCREMENT,dateCreated TEXT,address TEXT,balance TEXT,unit TEXT,idAccountType TEXT,lastUpdated TEXT)",
        []
      );
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
        localDB.tableName.tblTransaction +
        " (id  INTEGER PRIMARY KEY AUTOINCREMENT,dateCreated TEXT,transactionHash TEXT,balance TEXT,unit TEXT,credit INTEGER,lastUpdated TEXT,confirmations INTEGER)",
        []
      );
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
