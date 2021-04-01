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
            err: "WRONG_DATA_FORMAT",
            msg: 'Username must be more than 4 characters'
        });
    }

    if (!Validations.minLength(req.body.password, 8) || !Validations.isPassword(req.body.password)) {
        return res.status(422).json({
            err: "WRONG_DATA_FORMAT",
            msg: 'Password format incorrect'
        });
    }

    if (!Validations.isEmail(req.body.email)) {
        return res.status(422).json({
            err: "WRONG_DATA_FORMAT",
            msg: 'Email format incorrect'
        });
    }

    var hashedPassword = "";

    await encryption.hashPassword(req.body.password).then(function (hash) {
        hashedPassword = hash;
    }).catch(() => {
        return res.status(422).json({
            err: "SERVER_ERROR",
            msg: 'Registration error'
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
                    err: "EMAIL_EXISTS",
                    msg: 'Email already registered',
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
                        err: 'SERVER_ERROR',
                        msg: 'Registration error',
                    });
                });
            };

            return res.status(200).json({
                msg: 'User signedUp successfuly',
                data: result.insertId
            });
        });

    }).catch(() => setImmediate(() => {
        return res.status(500).json({
            err: "SERVER_ERROR",
            msg: "Registration error"
        });
    }));
};

// -------- Sign in -------- //
module.exports.signIn = async (req, res) => {

    var sql = "SELECT Userid, Password, Username FROM user WHERE Email= '" + req.body.email + "'";
    DBConnection.query(sql, function (err, result) {
        if (err) {
            return res.status(500).json({
                err: "SERVER_ERROR",
                msg: "Registration error"
            });
        };
        if (result.length == 0) {
            return res.status(404).json({
                err: "USER_NOT_FOUND",
                msg: 'Wrong email or password'
            });
        };
        encryption.comparePasswordToHash(req.body.password, result[0].Password).then((matches) => {
            if (matches) {
                var token = jwt.sign({ id: result[0].Userid, username: result[0].Username }, secret.secret, {
                    expiresIn:
                        86400 // expires in 24 hours
                });

                var userSession = jwt.verify(token, secret.secret, function (err, decoded) {
                    if (err) {
                        return res.status(500).json({
                            err: "SERVER_ERROR",
                            msg: "Registration error"
                        });
                    }
                    return decoded;
                });
                console.log(userSession);
                return res.status(200).json({
                    msg: 'User found.',
                    data: {
                        "token": token,
                        "username": userSession.username,
                        "id": userSession.id,
                        "iat": userSession.iat,
                        "exp": userSession.exp
                    }
                });
            }
            else {
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
    var token = req.headers.bearer.split(' ')[1];
    console.log(token);
    if (!token) return res.status(401).json({ err: "NO_TOKEN", msg: 'User is not authenticated' });

    jwt.verify(token, secret.secret, function (err, decoded) {
        if (err) return res.status(500).json({ err: "INVALID_TOKEN", msg: 'User is not authenticated' });

        return res.status(200).send(decoded);
    });
}

// -------- Get User -------- //
module.exports.getUserByEmail = async (req, res) => {
    var sql = "SELECT Userid ,Username, Email FROM user where Email = '" + req.body.username + "'";
    DBConnection.query(sql, function (err, result) {
        if (err) {
            return res.status(500).json({
                err: "SERVER_ERROR",
                msg: "Server error"
            });
        }
        if (result.length == 0) {
            return res.status(404).json({
                err: "USER_NOT_FOUND",
                msg: "User not found",
            });
        }
        return res.status(200).json({
            msg: "User found",
            data: result[0]
        });
    })
}