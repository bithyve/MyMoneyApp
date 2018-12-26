import React, { Component } from "react";

//TODO: Custome Pages
import { colors, images, localDB } from "../../constants/Constants";
import SQLite from "react-native-sqlite-storage";
var db = SQLite.openDatabase(localDB.dbName, "1.0", "MyMoney Database", 200000);



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
        " (date,firstName,lastName,email,country,mobileNo) VALUES (:date,:firstName,:lastName,:email,:country,:mobileNo)",
        [
          fulldate,
          firstName,
          lastName,
          email,
          country,
          mobileNumber,
        ]
      );
      resolve(true);
    });
  });
}





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
        " (date,mnemonic,privateKey,address) VALUES (:date,:mnemonic,:privateKey,:address)",
        [
          fulldate,
          mnemonicValue,
          priKeyValue,
          address
        ]
      );
    });

    db.transaction(function (txn) {
      txn.executeSql(
        "INSERT INTO " +
        tblName1 +
        " (date,mnemonic,privateKey,address,amount,amountUnit,accountType) VALUES (:date,:mnemonic,:privateKey,:address,:amount,:amountUnit,:accountType)",
        [
          fulldate,
          mnemonicValue,
          priKeyValue,
          address,
          '0.0',
          'BTC',
          'Saving'
        ]
      );
    });
    db.transaction(function (txn) {
      txn.executeSql(
        "INSERT INTO " +
        tblName1 +
        " (date,mnemonic,privateKey,address,amount,amountUnit,accountType) VALUES (:date,:mnemonic,:privateKey,:address,:amount,:amountUnit,:accountType)",
        [
          fulldate,
          mnemonicValue,
          priKeyValue,
          address,
          '0.0',
          'BTC',
          'UnKnown'
        ]
      );
      resolve(true);
    });
  });
}







module.exports = {
  readTablesData,
  insertUserDetailsData,
  insertWalletAndCreateAccountType
};
