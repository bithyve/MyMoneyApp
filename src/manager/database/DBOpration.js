import React, { Component } from "react";

//TODO: Custome Pages
import { colors, images, localDB } from "../../constants/Constants";
import SQLite from "react-native-sqlite-storage";
var db = SQLite.openDatabase(localDB.dbName, "1.0", "MyMoney Database", 200000);


//TODO: Select
const readTablesData = tableName => {
  return new Promise((resolve, reject) => {
    var temp = [];
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM " + tableName, [], (tx, results) => {
        var len = results.rows.length;
        if (len > 0) {
          for (let i = 0; i < len; i++) {
            temp.push(results.rows.item(i));
          }
          resolve({ temp });
        }
      });
    });
  });
}

//TODO: Update

//tblAmount
const updateTableData = (tblName, balance, address,lastUdateDate) => {
  return new Promise((resolve, reject) => {
    db.transaction(function (txn) {  
      txn.executeSql(
        "update " +
        tblName +
        " set balance = :amount,lastUpdated = :lastUpdated where address = :address",
        [
          balance,
          lastUdateDate,
          address,  
        ]
      );
      resolve(true);
    });
  });
}




//TODO: Insert

//tblUserDetails
const insertUserDetailsData = (tblName, fulldate,
  firstName,
  lastName,
  email,
  country,
  mobileNumber) => {
  return new Promise((resolve, reject) => {
    db.transaction(function (txn) {
      txn.executeSql(
        "INSERT INTO " +
        tblName +
        " (dateCreated,firstName,lastName,email,country,mobileNo,lastUpdated) VALUES (:dateCreated,:firstName,:lastName,:email,:country,:mobileNo,:lastUpdated)",
        [
          fulldate,
          firstName,
          lastName,
          email,
          country,
          mobileNumber,
          fulldate,
        ]
      );
      resolve(true);
    });
  });
}






//tblWallet and  tblAccount
const insertWalletAndCreateAccountType = (tblName, tblName1,
  fulldate,
  mnemonicValue,
  priKeyValue,
  address
) => {
  return new Promise((resolve, reject) => {
    db.transaction(function (txn) {
      txn.executeSql(
        "INSERT INTO " +
        tblName +
        " (dateCreated,mnemonic,privateKey,address,lastUpdated) VALUES (:dateCreated,:mnemonic,:privateKey,:address,:lastUpdated)",
        [
          fulldate,
          mnemonicValue,
          priKeyValue,
          address,
          fulldate
        ]
      );
    });

    db.transaction(function (txn) {
      txn.executeSql(
        "INSERT INTO " +
        tblName1 +
        "(dateCreated,address,balance,unit,idAccountType,lastUpdated) VALUES (:dateCreated,:address,:balance,:unit,:idAccountType,:lastUpdated)",
        [
          fulldate,
          address,
          0.0,
          'BTC',
          'Savings',  
          fulldate
        ]
      );
    });
    db.transaction(function (txn) {
      txn.executeSql(
        "INSERT INTO " +
        tblName1 +
        "(dateCreated,address,balance,unit,idAccountType,lastUpdated) VALUES (:dateCreated,:address,:balance,:unit,:idAccountType,:lastUpdated)",
        [
          fulldate,
          address,
          0.0,  
          'BTC',
          'UnKnown',
          fulldate  
        ]
      );
      resolve(true);
    });
  });
}
  






module.exports = {
  readTablesData,
  insertUserDetailsData,
  insertWalletAndCreateAccountType,
  updateTableData
};
