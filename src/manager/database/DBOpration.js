import React, { Component } from "react";

//TODO: Custome Pages
import { colors, images, localDB } from "../../constants/Constants";
import SQLite from "react-native-sqlite-storage";
var db = SQLite.openDatabase(localDB.dbName, "1.0", "MyMoney Database", 200000);

//TODO: Json Files
import accountTypeData from "../../assets/jsonfiles/tblAccountType/tblAccountType.json";

//TODO: Select All Table Data
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
};

//TODO: Select tblAccountType
const readTableAcccountType = (tableName1, tableName2) => {
  return new Promise((resolve, reject) => {
    var temp = [];
    db.transaction(tx => {
      tx.executeSql(
        "select name from " +
          tableName1 +
          " where name not in (select accountType from " +
          tableName2 +
          ")",
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              temp.push(results.rows.item(i));
            }
            resolve({ temp });
          }
        }
      );
    });
  });
};

//TODO: Select Recent Transaciton Address Wise

const readRecentTransactionAddressWise = (tableName, address) => {
  console.log({ tableName, address });
  return new Promise((resolve, reject) => {
    var temp = [];
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM " +
          tableName +
          " where accountAddress = '" +
          address +
          "' order by id desc limit 0,10",
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              temp.push(results.rows.item(i));
            }
            console.log({ temp });
            resolve({ temp });
          }
        }
      );
    });
  });
};

//TODO: Update

//tblAmount
const updateTableData = (tblName, balance, address, lastUdateDate) => {
  return new Promise((resolve, reject) => {
    db.transaction(function(txn) {
      txn.executeSql(
        "update " +
          tblName +
          " set balance = :amount,lastUpdated = :lastUpdated where address = :address",
        [balance, lastUdateDate, address]
      );
      resolve(true);
    });
  });
};

//TODO: Insert

//Insert tblAccountType
const insertAccountTypeData = (tblName, txtDate) => {
  return new Promise((resolve, reject) => {
    db.transaction(function(txn) {
      if (accountTypeData) {
        var len = accountTypeData.accountType.length;
        if (len > 0) {
          for (let i = 0; i < len; i++) {
            var data = accountTypeData.accountType[i];
            txn.executeSql(
              "INSERT INTO " +
                tblName +
                " (dateCreated,name,lastUpdated) VALUES (:dateCreated,:name,:lastUpdated)",
              [txtDate, data.name, txtDate]
            );
          }
        }
      }
      resolve(true);
    });
  });
};

//tblUserDetails
const insertUserDetailsData = (
  tblName,
  fulldate,
  firstName,
  lastName,
  email,
  country,
  mobileNumber
) => {
  return new Promise((resolve, reject) => {
    db.transaction(function(txn) {
      txn.executeSql(
        "INSERT INTO " +
          tblName +
          " (dateCreated,firstName,lastName,email,country,mobileNo,lastUpdated) VALUES (:dateCreated,:firstName,:lastName,:email,:country,:mobileNo,:lastUpdated)",
        [fulldate, firstName, lastName, email, country, mobileNumber, fulldate]
      );
      resolve(true);
    });
  });
};

//tblWallet and  tblAccount
const insertWalletAndCreateAccountType = (
  tblName,
  tblName1,
  fulldate,
  mnemonicValue,
  priKeyValue,
  address
) => {
  return new Promise((resolve, reject) => {
    db.transaction(function(txn) {
      txn.executeSql(
        "INSERT INTO " +
          tblName +
          " (dateCreated,mnemonic,privateKey,address,lastUpdated) VALUES (:dateCreated,:mnemonic,:privateKey,:address,:lastUpdated)",
        [fulldate, mnemonicValue, priKeyValue, address, fulldate]
      );
    });

    db.transaction(function(txn) {
      txn.executeSql(
        "INSERT INTO " +
          tblName1 +
          "(dateCreated,address,balance,unit,accountType,lastUpdated) VALUES (:dateCreated,:address,:balance,:unit,:accountType,:lastUpdated)",
        [fulldate, address, 0.0, "BTC", "Savings", fulldate]
      );
    });
    db.transaction(function(txn) {
      txn.executeSql(
        "INSERT INTO " +
          tblName1 +
          "(dateCreated,address,balance,unit,accountType,lastUpdated) VALUES (:dateCreated,:address,:balance,:unit,:accountType,:lastUpdated)",
        [fulldate, address, 0.0, "BTC", "UnKnown", fulldate]
      );
      resolve(true);
    });
  });
};
  
//TODO: Insert tblTransaction
const insertTblTransation = (tblName, transactionDetails,address,fulldate) => {
  let bal;
  if (transactionDetails[0].transactionType == "Received") {
    bal = transactionDetails[0].totalReceived;
  } else {
    bal = transactionDetails[0].totalSpent;
  }
  return new Promise((resolve, reject) => {
    db.transaction(function(txn) {
      //delete
      txn.executeSql(
        "DELETE FROM " +
          tblName +
          " WHERE accountAddress = '" +
          address +
          "'"  
      );      
      //insert  
      txn.executeSql(
        "INSERT INTO " +
          tblName +
          "(dateCreated,accountAddress,transactionHash,balance,unit,transactionType,confirmationType,lastUpdated) VALUES (:dateCreated,:accountAddress,:transactionHash,:balance,:unit,:transactionType,:confirmationType,:lastUpdated)",
        [  
          transactionDetails[0].received,
          address,
          transactionDetails[0].hash,
          bal,
          "BTC",
          transactionDetails[0].transactionType,
          transactionDetails[0].confirmationType,
          fulldate  
        ]
      );
      resolve(true);
    });
  });
};

module.exports = {
  readTablesData,
  readTableAcccountType,
  readRecentTransactionAddressWise,
  insertAccountTypeData,
  insertUserDetailsData,
  insertWalletAndCreateAccountType,
  insertTblTransation,
  updateTableData
};
