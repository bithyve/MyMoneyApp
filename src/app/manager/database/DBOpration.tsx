//TODO: Custome Pages
import { colors, images, localDB } from "../../../app/constants/Constants";
var utils = require("../../../app/constants/Utils");
import Singleton from "../../constants/Singleton";
import "../../../assets/static/js/sugar.js";

const getPasscode = () => {
  let commonData = Singleton.getInstance();
  return commonData.getPasscode();
};

import SQLite from "react-native-sqlite-storage";
var db = SQLite.openDatabase(localDB.dbName, "1.0", "MyMoney Database", 200000);

//TODO: Json Files
import accountTypeData from "../../../assets/jsonfiles/tblAccountType/tblAccountType.json";

//TODO: Select All Table Data
const readTablesData = tableName => {
  let passcode = getPasscode();
  return new Promise((resolve, reject) => {
    var temp = [];
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM " + tableName, [], (tx, results) => {
        var len = results.rows.length;
        if (len > 0) {
          for (let i = 0; i < len; i++) {
            let data = results.rows.item(i);
            if (tableName == "tblWallet") {
              data.id = data.id;
              data.address = utils.decrypt(data.address, passcode);
              data.privateKey = utils.decrypt(data.privateKey, passcode);
              data.mnemonic = utils.decrypt(data.mnemonic, passcode);
              data.dateCreated = data.dateCreated;
              data.lastUpdated = data.lastUpdated;
              data.walletType = data.walletType;
              temp.push(data);
            } else {
              temp.push(data);
            }
          }
          resolve({ temp });
        }
      });
    });
  });
};

const readAccountTablesData = tableName => {
  let passcode = getPasscode();
  return new Promise((resolve, reject) => {
    var temp = [];
    db.transaction(tx => {
      let accountId: number;
      tx.executeSql("SELECT * FROM " + tableName, [], (tx, results) => {
        var len = results.rows.length;
        if (len > 0) {
          for (let i = 0; i < len; i++) {
            let dbaccountType = utils.decrypt(
              results.rows.item(i).accountType,
              passcode
            );
            if (dbaccountType == "UnKnown") {
              accountId = parseInt(results.rows.item(i).id);
              break;
            }
          }
        }
        tx.executeSql(
          "SELECT * from " +
            tableName +
            " ORDER BY (id= " +
            accountId +
            ") ASC",
          [],
          (tx, results) => {
            var len = results.rows.length;
            if (len > 0) {
              for (let i = 0; i < len; i++) {
                let data = results.rows.item(i);
                data.id = data.id;
                data.dateCreated = utils.decrypt(data.dateCreated, passcode);
                data.lastUpdated = utils.decrypt(data.lastUpdated, passcode);
                data.accountType = utils.decrypt(data.accountType, passcode);
                data.address = utils.decrypt(data.address, passcode);
                data.additionalInfo = utils.decrypt(
                  data.additionalInfo,
                  passcode
                );
                data.balance = utils.decrypt(data.balance, passcode);
                data.unit = utils.decrypt(data.unit, passcode);
                temp.push(data);
              }
              resolve({ temp });
            }
          }
        );
      });
    });
  });
};

//TODO: Select tblAccountType
const readTableAcccountType = async (tableName1, tableName2) => {
  let passcode = getPasscode();
  return new Promise((resolve, reject) => {
    var temp = [];
    db.transaction(tx => {
      tx.executeSql("select name  from " + tableName1, [], (tx, results) => {
        var len = results.rows.length;
        if (len > 0) {
          for (let i = 0; i < len; i++) {
            var data = results.rows.item(i);
            data.name = utils.decrypt(results.rows.item(i).name, passcode);
            temp.push(data);
          }
          temp.shift();
          temp.pop();
          tx.executeSql(
            "select accountType  from " + tableName2,
            [],
            (tx2, results2) => {
              var len2 = results2.rows.length;
              if (len2 > 0) {
                for (let i2 = 0; i2 < len2; i2++) {
                  var data2 = {};
                  data2.name = utils.decrypt(
                    results2.rows.item(i2).accountType,
                    passcode
                  );
                  if (data2.name == "Secure") {
                    for (var i = 0; i < temp.length; i++)
                      if (temp[i].name === "Secure") {
                        temp.splice(i, 1);
                        break;
                      }
                  } else if (data2.name == "Joint") {
                    for (var i = 0; i < temp.length; i++)
                      if (temp[i].name === "Joint") {
                        temp.splice(i, 1);
                        break;
                      }
                  }
                }  
              }
            }
          );
          resolve({ temp });
        }
      });
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
  let passcode = getPasscode();
  return new Promise((resolve, reject) => {
    try {
      db.transaction(function(txn) {
        //select all data form tblAccount
        let accountId;
        txn.executeSql("SELECT * FROM " + tblName, [], (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              let dbdecryptAddress = utils.decrypt(
                results.rows.item(i).address,
                passcode
              );
              if (dbdecryptAddress == address) {
                accountId = results.rows.item(i).id;
              }
              txn.executeSql(
                "update " +
                  tblName +
                  " set balance = :amount,lastUpdated = :lastUpdated where id = :id",
                [
                  utils.encrypt(balance.toString(), passcode),
                  lastUdateDate,
                  accountId
                ]
              );
              resolve(true);
            }
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
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
              [txtDate, utils.encrypt(data.name, getPasscode()), txtDate]
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
  let passcode = getPasscode();
  return new Promise((resolve, reject) => {
    db.transaction(function(txn) {
      txn.executeSql(
        "INSERT INTO " +
          tblName +
          "(dateCreated,address,balance,unit,accountType,additionalInfo,lastUpdated) VALUES (:dateCreated,:address,:balance,:unit,:accountType,:additionalInfo,:lastUpdated)",
        [
          utils.encrypt(fulldate.toString(), passcode),
          utils.encrypt(address.toString(), passcode),
          utils.encrypt("0.0", passcode),
          utils.encrypt(unit.toString(), passcode),
          utils.encrypt(accountType.toString(), passcode),
          utils.encrypt(JSON.stringify(additionalInfo).toString(), passcode),
          utils.encrypt(fulldate.toString(), passcode)
        ]
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
  let passcode = getPasscode();
  return new Promise((resolve, reject) => {
    let date = utils.encrypt(fulldate.toString(), passcode);
    let add = utils.encrypt(address.toString(), passcode);
    let amount = utils.encrypt("0.0", passcode);
    let unitvalue = utils.encrypt(unit.toString(), passcode);
    let accountTypesValue = utils.encrypt(accountType.toString(), passcode);
    let moreInfo = utils.encrypt(
      JSON.stringify(additionalInfo).toString(),
      passcode
    );

    db.transaction(function(txn) {
      txn.executeSql(
        "INSERT INTO tblAccount(dateCreated,address,balance,unit,accountType,additionalInfo,lastUpdated) VALUES (:dateCreated,:address,:balance,:unit,:accountType,:additionalInfo,:lastUpdated)",
        [date, add, amount, unitvalue, accountTypesValue, moreInfo, date]
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
