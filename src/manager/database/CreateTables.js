import React, { Component } from 'react';
import RNFS from 'react-native-fs';
import SQLite from 'react-native-sqlite-storage';
import { localDB } from '../../constants/Constants';




export default class CreateTables extends Component {

    constructor(props) {
        super(props)
    }


    componentDidMount() {
        var db = SQLite.openDatabase({ name: localDB.dbName, readOnly: true, location: 'Library' }, this.openCB, this.errorCB);
        db.transaction(function (txn) {
            //txn.executeSql('DROP TABLE IF EXISTS ' + localDB.tableName.tblLogin, []);  
            txn.executeSql('CREATE TABLE IF NOT EXISTS ' + localDB.tableName.tblWallets + ' (id  INTEGER PRIMARY KEY AUTOINCREMENT,date TEXT,mnemonic TEXT,keypair TEXT,address TEXT)', []);
            console.log('create database.');
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
        return null
    }

}



