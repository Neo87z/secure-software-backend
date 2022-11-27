const express = require('express');
const router = express.Router();
var _ = require("underscore");
const bcrypt = require('bcrypt');
let Room = require('../models/room')
let User = require('../models/messageData')
let Bet = require('../models/betdata');
const { forEach } = require('underscore');
const dotenv = require('dotenv');

const jwt = require('jsonwebtoken')

const Messages = []
let EmployyeID;
let EmpoyeePassword;

let ManagerID;
let ManagerPassword;

Acess_KEY = "$2b$10$BD90Kkg4axivQpJAP1FDiOApkdqLtZ8j4q93qQOFATu/voN1ZGsd"
Admin_Key = "4$42b$10f$sssBD90Ksdkg42sadaxivQs2pJAP1FDiOApkdqLtZ8dj4q93qQOFATu/hvoN1ZGsd"
const fileUpload = require('express-fileupload');

API_KEY = 's'



module.exports = function () {




    const verifyJWT = (req, res, next) => {
        const token = req.headers["x-access-token"]
        const API_KEY = req.headers["x-dsi-api-key"]

        //console.log(Acess_KEY)
        console.log(API_KEY, 'lol')
        // console.log(token)



        if (API_KEY == Acess_KEY) {


            if (!token) {
                res.json({
                    auth: false,
                    Login: false,
                    Message: "Authenication 1Failed"
                });
            } else {
                jwt.verify(token, "jwtSecret", (err, decoded) => {
                    if (err) {
                        res.json({
                            auth: false,
                            Login: false,
                            Message: "Authenication Failed"
                        });
                    } else {
                        req.userID = decoded.id;
                        next();

                    }
                })

            }
        } else {
            res.json({
                auth: false,
                Login: false,
                Message: "Authenication Failed"
            });
        }



    }


    //Imlashi
    router.post('/login', function (req, res) {
        console.log(req.body.EmpoyeeID)
        console.log(req.body.Password)
        if (req.body.EmpoyeeID == EmployyeID) {
            if (req.body.Password == EmpoyeePassword) {

                const ID = parseInt(req.body.EmpoyeeID)
                const token = jwt.sign({ ID }, "jwtSecret", {
                    expiresIn: 300,
                })
                res.json({
                    Login: true,
                    token: token,
                    Type: "Manager",
                    Message: "User Logged In"
                });
                
            } else {
                res.json({
                    Login: false,
                    Message: "Login Fail"
                });
            }
        } else {
            if (req.body.EmpoyeeID == ManagerID) {
                if (req.body.Password == ManagerPassword) {
                    const ID = parseInt(req.body.EmpoyeeID)
                    const token = jwt.sign({ ID }, "jwtSecret", {
                        expiresIn: 300,
                    })
                    res.json({
                        Login: true,
                        token: token,
                        Type: "Worker",
                        Message: "User Logged In"
                    });

                } else {
                    res.json({
                        Login: false,
                        Message: "Login Fail"
                    });

                }

            } else {
                res.json({
                    Login: false,
                    Message: "Login Fail"
                });
            }

        }


    })

    router.get('/Authenicate', verifyJWT, function (req, res) {


        res.json({
            Login: true,
            auth: true,
            Message: "User Authenicated"
        });

    })



    router.get('/create-account', function (req, res) {

        const API_KEY = req.headers["x-dsi-api-key"]
        const Admin_KeYdata = req.headers["x-dsi-admin-key"]
        console.log(API_KEY)

        if (API_KEY == Acess_KEY) {
            if (Admin_KeYdata == Admin_Key) {
                EmployyeID = '112';
                EmpoyeePassword = 'abc';

                ManagerID = '900';
                ManagerPassword = 'abc';
                res.json({
                    Created: true,
                    auth: false,
                    Message: "Account Created"
                });


            } else {
                res.json({
                    Created: false,
                    auth: false,
                    Message: "Unauthorized"
                });


            }
        } else {
            res.json({
                Created: false,
                auth: false,
                Message: "Unauthorized"
            });

        }

    })

    router.post('/SaveMessages', verifyJWT,function (req, res) {

        console.log(req.body.Message)
        Messages.push(req.body.Message)

        res.json({

            Message: "Message Saved"
        });

    })

    router.get('/GetSavedMessages', verifyJWT, function (req, res) {


        res.json({

            Message: Messages
        });

    })



    return router;
}