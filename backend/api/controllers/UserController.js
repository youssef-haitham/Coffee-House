const mysql = require('mysql'),
    promise = require('promise'),
    Validations = require('../utils/Validations'),
    DBConnection = require("../config/DBConnection"),
    jwt = require('jsonwebtoken'),
    secret = require('../config/Secret'),
    encryption = require('../utils/Encryption');


// -------- create user and send token -------- //
module.exports.createUser = async (req, res) => {

    if (!Validations.minLength(req.body.username, 4)) {
        return res.status(422).json({
            err: "Wrong data format",
            msg: 'Username must be more than 4 characters'
        });
    }

    if (!Validations.minLength(req.body.password, 8) || !Validations.isPassword(req.body.password)) {
        return res.status(422).json({
            err: "Wrong data format",
            msg: 'Password format incorrect'
        });
    }

    if (!Validations.isEmail(req.body.email)) {
        return res.status(422).json({
            err: null,
            msg: 'Email format incorrect'
        });
    }

    var hashedPassword = "";

    await encryption.hashPassword(req.body.password).then(function (hash) {
        hashedPassword = hash;
    }).catch((err) => {
        return res.status(422).json({
            err: err.message,
            msg: 'Password not hashed correctly'
        })
    });



    var userPromise = new Promise(function (resolve) {

        var sql = "INSERT INTO user (Username, Email, Password) VALUES ?";
        var values = [
            [
                req.body.username, req.body.email, hashedPassword
            ]
        ];
        DBConnection.query(sql, [values], function (err, result) {
            if (err) {
                return res.status(500).json({
                    err: "Error while creating user",
                    msg: 'User already registered',
                    data: null
                });
            };
            resolve(result);
        });
    });

    return userPromise.then(function (result) {
        var sql = "INSERT INTO location (Userid, Location) VALUES ?";
        var values = [];
        for (i = 0; i < req.body.locations.length; i++) {
            values.push([result.insertId, req.body.locations[i]]);
        }
        DBConnection.query(sql, [values], function (err) {
            if (err) {
                var sql = "DELETE FROM user WHERE Userid = " + result.insertId;
                DBConnection.query(sql, function () {
                    return res.status(500).json({
                        err: 'Error while adding locations',
                        msg: 'Error while creating user',
                        data: null
                    });
                });
            };

            return res.status(200).json({
                err: null,
                msg: 'User signedUp successfuly',
                data: result.insertId
            });
        });

    }).catch((err) => setImmediate(() => {
        return res.status(500).json({
            err: err.message,
            msg: "Internal server error"
        });
    }));
};

// -------- Sign in -------- //
module.exports.signIn = async (req, res) => {

    var sql = "SELECT Userid, Password FROM user WHERE Username= '" + req.body.username + "'";
    DBConnection.query(sql, function (err, result) {
        if (err) {
            return res.status(500).json({
                err: err.message,
                msg: ''
            });
        };
        if (result.length == 0) {
            return res.status(404).json({
                err: "User not found",
                msg: 'User not found'
            });
        };
        encryption.comparePasswordToHash(req.body.password, result[0].Password).then((matches) => {
            if(matches){
                var token = jwt.sign({ id: result[0].Userid }, secret.secret, {
                    expiresIn:
                        86400 // expires in 24 hours
                });
    
                var userSession = jwt.verify(token, secret.secret, function (err, decoded) {
                    if (err) return "Error creating token";
                    return decoded;
                });
                return res.status(200).json({
                    msg: 'User found.',
                    data: {
                        "token": token,
                        "id": userSession.id,
                        "iat": userSession.iat,
                        "exp": userSession.exp
                    }
                });
            }
            else{
                return res.status(404).json({
                    msg: "Incorrect password"
                });
            }
        }
        ).catch((err) => {
            return res.status(500).json({
                err: err.message,
                msg: "Internal server error"
            });
        });
    });
};

// -------- Verify token -------- //
module.exports.verifyToken = async (req, res) => {
    var token = req.headers['Bearer'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, secret.secret, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        return res.status(200).send(decoded);
    });
}

// -------- Get User -------- //
module.exports.getUser = async (req, res) => {
    var sql = "SELECT Username, Email FROM user where Username = '" + req.body.username + "'";
    DBConnection.query(sql, function (err, result) {
        if (err) {
            return res.status(500).json({
                err: err,
                msg: "Server error",
                data: null
            });
        }
        if (result.length == 0) {
            return res.status(404).json({
                err: null,
                msg: "User not found",
                data: null
            });
        }
        return res.status(200).json({
            err: null,
            msg: "User found",
            data: result[0]
        });
    })
}