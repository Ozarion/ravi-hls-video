const mysql = require("mysql");
const logger = require("../utils/logger");
const config = require("../utils/config");

const DbConnection = function () {
    var db = null;
    var instance = 0;

    async function DbConnect() {
        try {
            const con = mysql.createConnection({
                host: config.db.host,
                user: config.db.user,
                password: config.db.password,
                database: config.db.database
            });

            con.connect(function (err) {
                if (err) throw err;
                logger.log("Connected!");
            });

            return con;
        } catch (e) {
            return e;
        }
    }

    async function Get() {
        try {
            instance++;     // this is just to count how many times our singleton is called.
            logger.log(`DbConnection called ${instance} times`);

            if (db != null) {
                logger.log(`db connection is already alive`);
                return db;
            } else {
                logger.log(`getting new db connection`);
                db = await DbConnect();
                return db;
            }
        } catch (e) {
            return e;
        }
    }

    return {
        Get: Get
    }
}

module.exports = DbConnection();