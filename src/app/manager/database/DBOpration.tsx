//TODO: Custome Pages
import { colors, images, localDB } from "../../../app/constants/Constants";
var utils = require("../../../app/constants/Utils");   


import SQLite from "react-native-sqlite-storage";
var db = SQLite.openDatabase(localDB.dbName, "1.0", "MyMoney Database", 200000);

//TODO: Json Files
import accountTypeData from "../../../assets/jsonfiles/tblAccountType/tblAccountType.json";

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

const readAccountTablesData = tableName => {
  return new Promise((resolve, reject) => {
    var temp = [];
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * from " + tableName + " ORDER BY (accountType='UnKnown') ASC",
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
  return new Promise((resolve, reject) => {
    var temp = [];
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM " +
          tableName +
          " where accountAddress = '" +
          address +
          "' order by id asc limit 0,10",
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              temp.push(results.rows.item(i));
            }
          }
          console.log(
            "total readRecentTransactionAddressWise data =" + { temp }
          );
          resolve({ temp });
        }
      );
    });
  });
};

//select:readAccountAddress

const readAccountAddress = (tableName, col1) => {
  return new Promise((resolve, reject) => {
    var temp = [];
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM " +
          tableName +
          " where accountType = '" +
          col1 +
          "' limit 0,1",
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

//select:readWalletAddress
const readWalletAddress = (tableName, col1) => {
  return new Promise((resolve, reject) => {
    var temp = [];
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM " +
          tableName +
          " where walletType = '" +
          col1 +
          "' limit 0,1",
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

//TODO: Update

//update:tblAmount
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

//update:tblUser
const updateUserDetails = (
  tblName,
  firstName,
  lastName,
  country,
  cca2,
  mobileNo,
  email,
  lastUpdateDate,
  id
) => {
  return new Promise((resolve, reject) => {
    db.transaction(function(txn) {
      txn.executeSql(
        "update " +
          tblName +
          " set firstName = :firstName,lastName = :lastName,email = :email,country =:country,cca2 = :cca2,mobileNo = :mobileNo,lastUpdated = :lastUpdated where id = :id",
        [
          firstName,
          lastName,
          email,
          country,
          cca2,
          mobileNo,
          lastUpdateDate,
          id
        ]
      );
      resolve(true);
    });
  });
};

//update:tblUser Profile Pic image
const updateUserProfilePic = (tblName, imagePath, id) => {
  return new Promise((resolve, reject) => {
    db.transaction(function(txn) {
      txn.executeSql(
        "update " + tblName + " set imagePath = :imagePath where id = :id",
        [imagePath, id]
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

//insert:tblUserDetails
const insertUserDetailsData = (
  tblName,
  fulldate,
  firstName,
  lastName,
  email,
  country,
  cca2,
  mobileNumber
) => {
  return new Promise((resolve, reject) => {
    db.transaction(function(txn) {
      txn.executeSql(
        "INSERT INTO " +
          tblName +
          " (dateCreated,firstName,lastName,email,country,cca2,mobileNo,imagePath,lastUpdated) VALUES (:dateCreated,:firstName,:lastName,:email,:country,:callingCode,:mobileNo,:imagePath,:lastUpdated)",
        [
          fulldate,
          firstName,
          lastName,
          email,
          country,
          cca2,
          mobileNumber,
          "",
          fulldate
        ]
      );
      resolve(true);
    });
  });
};

//insert:tblWallet

const insertWallet = (
  tblName,
  fulldate,
  mnemonicValue,
  priKeyValue,
  address,
  walletType
) => {
  return new Promise((resolve, reject) => {
    db.transaction(function(txn) {
      txn.executeSql(
        "INSERT INTO " +
          tblName +
          " (dateCreated,mnemonic,privateKey,address,walletType,lastUpdated) VALUES (:dateCreated,:mnemonic,:privateKey,:address,:walletType,:lastUpdated)",
        [fulldate, mnemonicValue, priKeyValue, address, walletType, fulldate]
      );
      resolve(true);
    });
  });
};

//insert: tblAccount Only First Time
const insertCreateAccount = (
  tblName,
  fulldate,
  address,
  unit,
  accountType,
  additionalInfo
) => {
  return new Promise((resolve, reject) => {
    db.transaction(function(txn) {
      txn.executeSql(
        "INSERT INTO " +
          tblName +
          "(dateCreated,address,balance,unit,accountType,additionalInfo,lastUpdated) VALUES (:dateCreated,:address,:balance,:unit,:accountType,:additionalInfo,:lastUpdated)",
        [fulldate, address, 0.0, unit, accountType, additionalInfo, fulldate]
      );
      resolve(true);
    });
  });
};

const insertLastBeforeCreateAccount = (
  tblName,
  fulldate,
  address,
  unit,
  accountType,
  additionalInfo
) => {
  return new Promise((resolve, reject) => {
    db.transaction(function(txn) {
      txn.executeSql(
        "INSERT INTO tblAccount(dateCreated,address,balance,unit,accountType,additionalInfo,lastUpdated) VALUES (:dateCreated,:address,:balance,:unit,:accountType,:additionalInfo,:lastUpdated)",
        [fulldate, address, 0.0, unit, accountType, additionalInfo, fulldate]
      );
      resolve(true);
    });
  });
};

//TODO: Insert tblTransaction
const insertTblTransation = (
  tblName,
  transactionDetails,
  address,
  fulldate
) => {
  let bal;

  return new Promise((resolve, reject) => {
    db.transaction(function(txn) {
      //delete
      txn.executeSql(
        "DELETE FROM " + tblName + " WHERE accountAddress = '" + address + "'"
      );
      console.log("trnasation length=", transactionDetails.length);
      //insert
      for (i = 0; i < transactionDetails.length; i++) {
        if (transactionDetails[i].transactionType == "Received") {
          bal = transactionDetails[i].totalReceived;
        } else {
          bal = transactionDetails[i].totalSpent;
        }
        txn.executeSql(
          "INSERT INTO " +
            tblName +
            "(dateCreated,accountAddress,transactionHash,balance,unit,fees,transactionType,confirmationType,lastUpdated) VALUES (:dateCreated,:accountAddress,:transactionHash,:balance,:unit,:fees,:transactionType,:confirmationType,:lastUpdated)",
          [
            utils.getUnixTimeDate(transactionDetails[i].received),
            address,
            transactionDetails[i].hash,
            bal,
            "BTC",
            transactionDetails[i].fees,
            transactionDetails[i].transactionType,
            transactionDetails[i].confirmationType,
            fulldate
          ]
        );
      }
      resolve(true);
    });
  });
};

module.exports = {
  readTablesData,
  readAccountTablesData,
  readTableAcccountType,
  readRecentTransactionAddressWise,
  readAccountAddress,
  readWalletAddress,
  insertAccountTypeData,
  insertUserDetailsData,
  insertWallet,
  insertCreateAccount,
  insertLastBeforeCreateAccount,
  insertTblTransation,
  updateTableData,
  updateUserDetails,
  updateUserProfilePic
};
