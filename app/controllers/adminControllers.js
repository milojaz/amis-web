//importing the modules
const bcrypt = require('bcryptjs');
var fs = require('fs');



// models
var adminModel = require('../models/admin_model');
var enumeratorsModel = require('../models/enumerator_model');
var farmerModel = require('../models/farmerModel');
var make_orderModel = require('../models/make_order');
var avaProdPerDistModel = require('../models/avaProdPerDistModel');
var avaProductForSaleModel = require('../models/avaProductsModel');
var aboutModel = require('../models/about_model');
var learningModel = require('../models/learning_model');

// json data
var marketAPIData = require('../data/marketData.json');
var availableProductData = require('../data/ava_prod_by_district.json');
var farmersData = require('../data/farmers_data.json');

// Datable model
var exportFlowModel = require('../models/exportFlowModel');
var tradeFlowModel = require('../models/tradeFlowModel')
var productMarketModel = require('../models/marketDataModel')
var stockFlowModel = require('../models/stockFlowModel')

//import farmer Api by district

// wholesale products json 
var riceWholesaleData = require('../data/wholesale/prod_rice.json');
var cassavaWholesaleData = require('../data/wholesale/prod_cassava.json');
var coffeeWholesaleData = require('../data/wholesale/prod_coffee.json');
var palmoilWholesaleData = require('../data/wholesale/prod_palmoil.json');
var cacaoWholesaleData = require('../data/wholesale/prod_cacao.json');
var sweetpotatoWholesaleData = require('../data/wholesale/prod_sweetpotato.json');
var groundnutWholesaleData = require('../data/wholesale/prod_groundnut.json');
var maizeWholesaleData = require('../data/wholesale/prod_maize.json');

// retail products json 
var riceRetailData = require('../data/retail/prod_rice.json');
var cassavaRetailData = require('../data/retail/prod_cassava.json');
var coffeeRetailData = require('../data/retail/prod_coffee.json');
var palmoilRetailData = require('../data/retail/prod_palmoil.json');
var cacaoRetailData = require('../data/retail/prod_cacao.json');
var sweetpotatoRetailData = require('../data/retail/prod_sweetpotato.json');
var groundnutRetailData = require('../data/retail/prod_groundnut.json');
var maizeRetailData = require('../data/retail/prod_maize.json');

// retail products json 
var riceFarmGateData = require('../data/farmGate/prod_rice.json');
var cassavaFarmGateData = require('../data/farmGate/prod_cassava.json');
var coffeeFarmGateData = require('../data/farmGate/prod_coffee.json');
var palmoilFarmGateData = require('../data/farmGate/prod_palmoil.json');
var cacaoFarmGateData = require('../data/farmGate/prod_cacao.json');
var sweetpotatoFarmGateData = require('../data/farmGate/prod_sweetpotato.json');
var groundnutFarmGateData = require('../data/farmGate/prod_groundnut.json');
var maizeFarmGateData = require('../data/farmGate/prod_maize.json');

// custom functions
var { isEmpty } = require('../config/customFunction');

module.exports = {

    // index page get controller
    index: (req, res) => {
        res.render('adminLogin', {
            pageTitle: "admin",
            pageID: "admin"
        });
    },

    // login page post controller
    // postLogin: (req, res) => {
    //     res.send('login successful');
    // },

    // admin registrartion form  get contoller
    adminRegFormGet: (req, res) => {
        res.render('partials/admin/forms/signup', { adminUser: req.user });
    },

    // admin registrartion form  post contoller
    adminRegFormPost: (req, res) => {

        // fetching the data from the form
        const { fullName, email, password, password2, uploadedFile } = req.body;

        let errors = []; // will hold the errors

        // check reqiured fields
        if (!fullName || !email || !password || !password2) { // || !uploadedFile
            errors.push({ msg: 'Please fill in all fileds' });
        }

        // check if password match
        if (password != password2) {
            errors.push({ msg: 'Passwords do not match' });
        }

        // check password length
        if (password.length < 6) {
            errors.push({ msg: 'Password should be at least 6 character' });
        }

        // check if an error is found
        if (errors.length > 0) {
            res.render('partials/admin/forms/signup', {
                errors,
                fullName,
                email,
                password,
                password2,
                // uploadedFile
                adminUser: req.user
            });
        } else {

            // check if the user already exists
            adminModel.findOne({ email: email })
                .then(adminUser => {
                    if (adminUser) {
                        req.flash('error_msg', 'Email already exist');
                        res.redirect('/admin/register/admin');
                    } else {

                        // let filename = ''; // will hold the uploaded file

                        // if (!isEmpty(req.files)) {
                        //     let file = req.files.uploadedFile;
                        //     filename = file.name;
                        //     let uploadDir = '../public/images/adminsProfilePhotos/';

                        //     file.mv(uploadDir + filename, (err) => {
                        //         if (err)
                        //             console.log(err);
                        //     });
                        // }
                        // instantiating a new admin model
                        var newAdmin = new adminModel({
                            fullname: req.body.fullName,
                            email: req.body.email,
                            password: req.body.password
                                // photo: `/adminsProfilePhotos/${filename}`
                        });
                        // hashing the password
                        bcrypt.genSalt(10, function(err, salt) {
                            bcrypt.hash(newAdmin.password, salt, (err, hash) => {
                                if (err) throw err;
                                // set password to hash
                                newAdmin.password = hash;
                                newAdmin.save()
                                    .then(admin => {
                                        req.flash('success_msg', 'You have just registered a new administrator');
                                        res.redirect('/admin/register/admin');
                                        console.log(admin + '=>' + 'registration successful');

                                    })
                                    .catch(err => {
                                        console.log(err);
                                    });
                            });
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    },

    // dashboard get controller
    getDashboard: (req, res) => {

        adminModel.find()
            .then(adminUser => {
                make_orderModel.find().sort({ '_id': -1 })
                    .then(orders => {
                        res.render('partials/admin/main/dashboard', { adminUser: req.user, orders: orders });
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err);
            });
    },

    // order delete  controller
    deleteOrder: (req, res) => {
        const id = req.params.id;
        make_orderModel.findByIdAndDelete(id)
            .then(deletedOrder => {
                req.flash('success_msg', `The order from ${deletedOrder.name} has been deleted.`);
                res.redirect('/admin/dashboard');
            })
            .catch(err => {
                console.log(err);
            });
    },

    // admin logout controller
    getLogout: (req, res) => {
        req.logout(); //passport middleware
        req.flash('success_msg', 'You have logged out');
        res.redirect('/admin'); //redirecting to the login page
    },


    // dashboard vie controller
    getMarketDataTable: (req, res) => {
        productMarketModel.find().sort({ '_id': -1 })

        .then(marketData => {
                res.render('partials/admin/tables/marketDataTable', { adminUser: req.user, marketData: marketData });
            })
            .catch(err => {
                console.log(err);
            });
    },

    // stockflow get controller
    getTradeFlowDataTable: (req, res) => {
        // res.render('partials/admin/tables/tradeFlowDataTable', { adminUser: req.user });
        tradeFlowModel.find().sort({ '_id': -1 })
            .then(tradeData => {
                res.render('partials/admin/tables/tradeFlowDataTable', { adminUser: req.user, tradeData: tradeData });
            })
            .catch(err => {
                console.log(err);
            });
    },

    // Stock Level get controller
    getStockLevelDataTable: (req, res) => {
        stockFlowModel.find().sort({ '_id': -1 })
            .then(stockData => {
                res.render('partials/admin/tables/stockLevelDataTable', { adminUser: req.user, stockData: stockData });
            })
            .catch(err => {
                console.log(err);
            });
        // res.render('partials/admin/tables/stockLevelDataTable', { adminUser: req.user });
    },

    // enumerator get  controller
    enumeratorRegFormGet: (req, res) => {
        // rendering the page
        res.render('partials/admin/forms/enumeratorForm', {
            pageTitle: "enumerator",
            pageID: "enumerator",
            adminUser: req.user
        });
    },

    // enumeratorPost  controller
    enumeratorRegFormPost: (req, res) => {

        const { regFirstName, regLastName, regUsername, regEmail, regStAddress, regPhone, gender, regCity, regState, regPassword, regConfirmPassword } = req.body;

        // error arrays
        let errors = [];

        // check required fields
        if (!regFirstName || !regLastName || !regUsername || !regEmail || !regStAddress || !regPhone || !gender || !regCity || !regState || !regPassword || !regConfirmPassword) {
            errors.push({ msg: 'Please fill in all fields' });
        }

        // check if password match
        if (regPassword != regConfirmPassword) {
            errors.push({ msg: 'Passwords do not match' });
        }

        // check password length
        if (regPassword.length < 6) {
            errors.push({ msg: 'Passwords should be at least 6 characters' });
        }

        // check if we do have some errors
        if (errors.length > 0) {
            // re-render the page
            res.render('partials/admin/forms/enumeratorForm', {
                pageTitle: "enumerator",
                pageID: "enumerator",
                adminUser: req.user,
                errors,
                regFirstName,
                regLastName,
                regUsername,
                regEmail,
                regStAddress,
                regPhone,
                gender,
                regCity,
                regState,
                regPassword,
                regConfirmPassword
            });
        } else {
            // if validation passed run the following below
            enumeratorsModel.findOne({ email: regEmail })
                .then(enumerator => {
                    if (enumerator) {
                        errors.push({ msg: 'A user with that email is already registered' });
                        res.render('partials/admin/forms/enumeratorForm', {
                            pageTitle: "enumerator",
                            pageID: "enumerator",
                            adminUser: req.user,
                            errors,
                            regFirstName,
                            regLastName,
                            regUsername,
                            regEmail,
                            regStAddress,
                            regPhone,
                            gender,
                            regCity,
                            regState,
                            regPassword,
                            regConfirmPassword
                        });
                    } else {
                        // instatiating a new enumerator
                        var newEnumerator = new enumeratorsModel({
                            firstName: regFirstName,
                            lastName: regLastName,
                            username: regUsername,
                            email: regEmail,
                            address: regStAddress,
                            phone: regPhone,
                            gender: gender,
                            city: regCity,
                            state: regState,
                            password: regPassword
                        });
                        // making reference to the createEnumerator function in the enumerator model
                        enumeratorsModel.createEnumerator(newEnumerator, (err, enumerator) => {
                            if (err) throw err; //throw an error
                            req.flash('success_msg', 'You have just registered a new enumerator');
                            res.redirect('/admin/register/enumerator');
                            console.log(enumerator);
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }

    },

    // farmer get controller
    farmerRegFormGet: (req, res) => {
        // rendering the page
        res.render('partials/admin/forms/farmerForm', {
            pageTitle: "enumerator",
            pageID: "enumerator",
            adminUser: req.user
        });
    },

    // farmerPost controller
    farmerRegFormPost: (req, res) => {
        // getting the variables
        const {
            fboName,
            listOfProd,
            location,
            chiefdom,
            district,
            region,
            totalNoOfWorkers,
            briefBio,
            execHeadName,
            execHeadAddress,
            execHeadTele,
            execHeadEmail,
            gender,
            uploadedFile
        } = req.body;

        // this variable will be used to validate
        var errors = req.validationErrors();

        // // checking if an error occurs
        if (errors) {
            res.render('partials/admin/forms/farmerForm', {
                errors: errors,
                adminUser: req.user,
                cboName,
                listOfProd,
                location,
                chiefdom,
                district,
                region,
                totalNoOfWorkers,
                briefBio,
                execHeadName,
                execHeadAddress,
                execHeadTele,
                execHeadEmail,
                gender
            });
        } else {

            farmerModel.findOne({ fbo_name: fboName })
                .then(fbo => {
                    if (fbo) {
                        req.flash('error_msg', 'An FBO with that name already exists. Please enter another CBO name.');
                        res.redirect('/admin/register/farmer');
                        errors: errors,
                            fboName,
                            listOfProd,
                            location,
                            chiefdom,
                            district,
                            region,
                            totalNoOfWorkers,
                            briefBio,
                            execHeadName,
                            execHeadAddress,
                            execHeadTele,
                            execHeadEmail,
                            gender
                    } else {
                        let filename = ''; // will hold the uploaded file

                        // if uploaded file is not empty
                        if (!isEmpty(req.files)) {
                            let file = req.files.uploadedFile;
                            filename = file.name;
                            let uploadDir = './app/public/images/fboUploads/';

                            file.mv(uploadDir + filename, (err) => {
                                if (err)
                                    console.log(err);
                            });
                        }
                        // instantiating a new farerModel
                        var newFarmer = new farmerModel({
                            fbo_name: fboName,
                            products: listOfProd,
                            location: location,
                            chiefdom: chiefdom,
                            district: district,
                            region: region,
                            total_no_of_staffs: totalNoOfWorkers,
                            brief_bio: briefBio,
                            executive_head_name: execHeadName,
                            executive_head_address: execHeadAddress,
                            executive_head_tele: execHeadTele,
                            executive_head_email: execHeadEmail,
                            gender: gender,
                            photo: `/images/fboUploads/${filename}`
                        });

                        // writing to the farmers json file
                        fs.writeFile('app/data/farmers_data.json', JSON.stringify(farmersData), 'utf8',
                                function(err) {
                                    console.log(err);
                                })
                            // saving the farmer detail
                        newFarmer.save()
                            .then(farmer => {
                                console.log(farmer);
                                req.flash('success_msg', 'New FBO registered successfully');
                                res.redirect('/admin/register/farmer');
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        } //error closing else brace

    },

    // create market data get controller
    marketDataGet: (req, res) => {
        // rendering the page
        productMarketModel.find().sort({ '_id': -1 })
            .then(marketData => {
                res.render('partials/admin/tables/marketDataTable', { adminUser: req.user, marketData: marketData });
            })
            .catch(err => {
                console.log(err);
            });
    },

    // export flow get controller
    exportFlowGet: (req, res) => {
        // fetching all the export data from the export flow model
        exportFlowModel.find().sort({ '_id': -1 })
            .then(exporter => {
                res.render('partials/admin/tables/exportFlowTable', { adminUser: req.user, exporter: exporter });

            })
            .catch(err => {
                console.log(err);
            });
    },

    // create wholesale data post controller
    wholesaleDataPost: (req, res) => {

        // this variable will be used to validate
        var errors = req.validationErrors();

        // checking if an error occurs
        if (errors) {
            res.render('partials/admin/forms/marketForm', {
                errors: errors,
                adminUser: req.user
            });
        } else {

            function checkDistrict(alldistricts, district) {
                return alldistricts.some(function(el) {
                    return el.district === district;
                });
            }
            //instantiating variables ;
            var district = req.body.district;
            var product = req.body.product; //.toUpperCase();
            var price = parseInt(req.body.price);

            // rest operators
            var newRiceData = [...riceWholesaleData]
            var newCassavaData = [...cassavaWholesaleData]
            var newPalmoilData = [...palmoilWholesaleData]
            var newCacaoData = [...cacaoWholesaleData]
            var newCoffeeData = [...coffeeWholesaleData]
            var newSweetpotatoData = [...sweetpotatoWholesaleData]
            var newGroundnutData = [...groundnutWholesaleData]
            var newMaizeData = [...maizeWholesaleData]


            switch (product) {
                case 'Rice':
                    if (checkDistrict(newRiceData, district)) {
                        var index = newRiceData.findIndex((data => data.district === district))
                        newRiceData[index].price = price
                            // newRiceData[index].price += price

                    } else {
                        newRiceData.push({ district, price });
                    }

                    // writing to the rice json file
                    fs.writeFile('app/data/wholesale/prod_rice.json', JSON.stringify(newRiceData), 'utf8',
                        function(err) {
                            console.log(err);
                        }
                    )
                    req.flash('success_msg', `New Product posted for ${district} Wholesale successfully`);
                    break;

                    // cassava case
                case 'Cassava':
                    if (checkDistrict(newCassavaData, district)) {
                        var index = newCassavaData.findIndex((data => data.district === district))
                        newCassavaData[index].price = price
                            // newCassavaData[index].price += price

                    } else {
                        newCassavaData.push({ district, price });
                    }

                    // writing to the cassava json file
                    fs.writeFile('app/data/wholesale/prod_cassava.json', JSON.stringify(newCassavaData), 'utf8',
                        function(err) {
                            console.log(err);
                        })
                    req.flash('success_msg', `New Product posted for ${district} Wholesale successfully`);

                    break;

                    // palmoil case
                case 'Palmoil':
                    if (checkDistrict(newPalmoilData, district)) {
                        var index = newPalmoilData.findIndex((data => data.district === district))
                        newPalmoilData[index].price = price
                            // newPalmoilData[index].price += price

                    } else {
                        newPalmoilData.push({ district, price });
                    }

                    // writing to the palmoil json file
                    fs.writeFile('app/data/wholesale/prod_palmoil.json', JSON.stringify(newPalmoilData), 'utf8',
                        function(err) {
                            console.log(err);
                        }
                    )
                    req.flash('success_msg', `New Product posted for ${district} Wholesale successfully`);

                    break;

                    // cacao case
                case 'Cacao':
                    if (checkDistrict(newCacaoData, district)) {
                        var index = newCacaoData.findIndex((data => data.district === district))
                        newCacaoData[index].price = price
                            // newCacaoData[index].price += price

                    } else {
                        newCacaoData.push({ district, price });
                    }

                    // writing to the cacao json file
                    fs.writeFile('app/data/wholesale/prod_cacao.json', JSON.stringify(newCacaoData), 'utf8',
                        function(err) {
                            console.log(err);
                        }
                    )
                    req.flash('success_msg', `New Product posted for ${district} Wholesale successfully`);

                    break;

                    // coffee case
                case 'Coffee':
                    if (checkDistrict(newCoffeeData, district)) {
                        var index = newCoffeeData.findIndex((data => data.district === district))
                        newCoffeeData[index].price = price
                            // newCoffeeData[index].price += price

                    } else {
                        newCoffeeData.push({ district, price });
                    }

                    // writing to the coffee json file
                    fs.writeFile('app/data/wholesale/prod_coffee.json', JSON.stringify(newCoffeeData), 'utf8',
                        function(err) {
                            console.log(err);
                        }
                    )
                    req.flash('success_msg', `New Product posted for ${district} Wholesale successfully`);

                    break;

                    // maize case
                case 'Maize':
                    if (checkDistrict(newMaizeData, district)) {
                        var index = newMaizeData.findIndex((data => data.district === district))
                        newMaizeData[index].price = price
                            // newMaizeData[index].price += price

                    } else {
                        newMaizeData.push({ district, price });
                    }

                    // writing to the coffee json file
                    fs.writeFile('app/data/wholesale/prod_maize.json', JSON.stringify(newMaizeData), 'utf8',
                        function(err) {
                            console.log(err);
                        }
                    )
                    req.flash('success_msg', `New Product posted for ${district} Wholesale successfully`);

                    break;

                    // sweet potato case
                case 'Sweet Potato':
                    if (checkDistrict(newSweetpotatoData, district)) {
                        var index = newSweetpotatoData.findIndex((data => data.district === district))
                        newSweetpotatoData[index].price = price
                            // newSweetpotatoData[index].price += price

                    } else {
                        newSweetpotatoData.push({ district, price });
                    }

                    // writing to the cacao json file
                    fs.writeFile('app/data/wholesale/prod_sweetpotato.json', JSON.stringify(newSweetpotatoData), 'utf8',
                        function(err) {
                            console.log(err);
                        }
                    )
                    req.flash('success_msg', `New Product posted for ${district} Wholesale successfully`);

                    break;

                    // groundnut case
                case 'Groundnut':
                    if (checkDistrict(newGroundnutData, district)) {
                        var index = newGroundnutData.findIndex((data => data.district === district))
                        newGroundnutData[index].price = price
                            // newGroundnutData[index].price += price

                    } else {
                        newGroundnutData.push({ district, price });
                    }

                    // writing to the coffee json file
                    fs.writeFile('app/data/wholesale/prod_groundnut.json', JSON.stringify(newGroundnutData), 'utf8',
                        function(err) {
                            console.log(err);
                        }
                    )
                    req.flash('success_msg', `New Product posted for ${district} Wholesale successfully`);

                    break;

                default:
                    console.log("input a product");
                    break;
            }

            req.flash('success_msg', 'You have posted a new market data');
            // res.redirect('/admin/createMarketData'); //redirecting to the create market page
            // res.render('partials/admin/forms/marketForm');
            res.render('partials/admin/forms/marketForm', {
                pageTitle: "postMarketData",
                pageID: "postMarketData",
                adminUser: req.user
            });
        } // closing else brace

    },

    // create retail data post controller
    retailDataPost: (req, res) => {

        // this variable will be used to validate
        var errors = req.validationErrors();

        // checking if an error occurs
        if (errors) {
            res.render('partials/admin/forms/marketForm', {
                errors: errors,
                adminUser: req.user
            });
        } else {

            function checkDistrict(alldistricts, district) {
                return alldistricts.some(function(el) {
                    return el.district === district;
                });
            }
            //instantiating variables ;
            var district = req.body.district;
            var product = req.body.product; //.toUpperCase();
            var price = parseInt(req.body.price);

            // rest operators
            var newRiceData = [...riceRetailData]
            var newCassavaData = [...cassavaRetailData]
            var newPalmoilData = [...coffeeRetailData]
            var newCacaoData = [...palmoilRetailData]
            var newCoffeeData = [...cacaoRetailData]
            var newSweetpotatoData = [...sweetpotatoRetailData]
            var newGroundnutData = [...groundnutRetailData]
            var newMaizeData = [...maizeRetailData]


            switch (product) {
                case 'Rice':
                    if (checkDistrict(newRiceData, district)) {
                        var index = newRiceData.findIndex((data => data.district === district))
                        newRiceData[index].price = price
                            // newRiceData[index].price += price

                    } else {
                        newRiceData.push({ district, price });
                    }

                    // writing to the rice json file
                    fs.writeFile('app/data/retail/prod_rice.json', JSON.stringify(newRiceData), 'utf8',
                        function(err) {
                            console.log(err);
                        }
                    )
                    req.flash('success_msg', `New Product posted for ${district} Retail successfully`);
                    break;

                    // cassava case
                case 'Cassava':
                    if (checkDistrict(newCassavaData, district)) {
                        var index = newCassavaData.findIndex((data => data.district === district))
                        newCassavaData[index].price = price
                            // newCassavaData[index].price += price

                    } else {
                        newCassavaData.push({ district, price });
                    }

                    // writing to the cassava json file
                    fs.writeFile('app/data/retail/prod_cassava.json', JSON.stringify(newCassavaData), 'utf8',
                        function(err) {
                            console.log(err);
                        }
                    )
                    req.flash('success_msg', `New Product posted for ${district} Retail successfully`);

                    break;

                    // palmoil case
                case 'Palmoil':
                    if (checkDistrict(newPalmoilData, district)) {
                        var index = newPalmoilData.findIndex((data => data.district === district))
                        newPalmoilData[index].price = price
                            // newPalmoilData[index].price += price

                    } else {
                        newPalmoilData.push({ district, price });
                    }

                    // writing to the palmoil json file
                    fs.writeFile('app/dataretail/prod_palmoil.json', JSON.stringify(newPalmoilData), 'utf8',
                        function(err) {
                            console.log(err);
                        }
                    )
                    req.flash('success_msg', `New Product posted for ${district} Retail successfully`);

                    break;

                    // cacao case
                case 'Cacao':
                    if (checkDistrict(newCacaoData, district)) {
                        var index = newCacaoData.findIndex((data => data.district === district))
                        newCacaoData[index].price = price
                            // newCacaoData[index].price += price

                    } else {
                        newCacaoData.push({ district, price });
                    }

                    // writing to the cacao json file
                    fs.writeFile('app/data/retail/prod_cacao.json', JSON.stringify(newCacaoData), 'utf8',
                        function(err) {
                            console.log(err);
                        }
                    )
                    req.flash('success_msg', `New Product posted for ${district} Retail successfully`);

                    break;

                    // coffee case
                case 'Coffee':
                    if (checkDistrict(newCoffeeData, district)) {
                        var index = newCoffeeData.findIndex((data => data.district === district))
                        newCoffeeData[index].price = price
                            // newCoffeeData[index].price += price

                    } else {
                        newCoffeeData.push({ district, price });
                    }

                    // writing to the coffee json file
                    fs.writeFile('app/data/retail/prod_coffee.json', JSON.stringify(newCoffeeData), 'utf8',
                        function(err) {
                            console.log(err);
                        }
                    )
                    req.flash('success_msg', `New Product posted for ${district} Retail successfully`);

                    break;

                    // maize case
                case 'Maize':
                    if (checkDistrict(newMaizeData, district)) {
                        var index = newMaizeData.findIndex((data => data.district === district))
                        newMaizeData[index].price = price
                            // newMaizeData[index].price += price

                    } else {
                        newMaizeData.push({ district, price });
                    }

                    // writing to the coffee json file
                    fs.writeFile('app/data/retail/prod_maize.json', JSON.stringify(newMaizeData), 'utf8',
                        function(err) {
                            console.log(err);
                        }
                    )
                    req.flash('success_msg', `New Product posted for ${district} Retail successfully`);

                    break;

                    // sweet potato case
                case 'Sweet Potato':
                    if (checkDistrict(newSweetpotatoData, district)) {
                        var index = newSweetpotatoData.findIndex((data => data.district === district))
                        newSweetpotatoData[index].price = price
                            // newSweetpotatoData[index].price += price

                    } else {
                        newSweetpotatoData.push({ district, price });
                    }

                    // writing to the cacao json file
                    fs.writeFile('app/data/retail/prod_sweetpotato.json', JSON.stringify(newSweetpotatoData), 'utf8',
                        function(err) {
                            console.log(err);
                        }
                    )
                    req.flash('success_msg', `New Product posted for ${district} Retail successfully`);

                    break;

                    // groundnut case
                case 'Groundnut':
                    if (checkDistrict(newGroundnutData, district)) {
                        var index = newGroundnutData.findIndex((data => data.district === district))
                        newGroundnutData[index].price = price
                            // newGroundnutData[index].price += price

                    } else {
                        newGroundnutData.push({ district, price });
                    }

                    // writing to the coffee json file
                    fs.writeFile('app/data/retail/prod_groundnut.json', JSON.stringify(newGroundnutData), 'utf8',
                        function(err) {
                            console.log(err);
                        }
                    )
                    req.flash('success_msg', `New Product posted for ${district} Retail successfully`);

                    break;

                default:
                    console.log("input a product");
                    break;
            }

            req.flash('success_msg', 'You have posted a new market data');
            // res.redirect('/admin/createMarketData'); //redirecting to the create market page
            // res.render('partials/admin/forms/marketForm');
            res.render('partials/admin/forms/marketForm', {
                pageTitle: "postMarketData",
                pageID: "postMarketData",
                adminUser: req.user
            });
        } // closing else brace

    },

    // create farm gate data post controller
    farmGateDataPost: (req, res) => {

        // this variable will be used to validate
        var errors = req.validationErrors();

        // checking if an error occurs
        if (errors) {
            res.render('partials/admin/forms/marketForm', {
                errors: errors,
                adminUser: req.user
            });
        } else {

            function checkDistrict(alldistricts, district) {
                return alldistricts.some(function(el) {
                    return el.district === district;
                });
            }
            //instantiating variables ;
            var district = req.body.district;
            var product = req.body.product; //.toUpperCase();
            var price = parseInt(req.body.price);

            // rest operators
            var newRiceData = [...riceFarmGateData]
            var newCassavaData = [...cassavaFarmGateData]
            var newPalmoilData = [...coffeeFarmGateData]
            var newCacaoData = [...palmoilFarmGateData]
            var newCoffeeData = [...cacaoFarmGateData]
            var newSweetpotatoData = [...sweetpotatoFarmGateData]
            var newGroundnutData = [...groundnutFarmGateData]
            var newMaizeData = [...maizeFarmGateData]


            switch (product) {
                case 'Rice':
                    if (checkDistrict(newRiceData, district)) {
                        var index = newRiceData.findIndex((data => data.district === district))
                        newRiceData[index].price = price
                            // newRiceData[index].price += price

                    } else {
                        newRiceData.push({ district, price });
                    }

                    // writing to the rice json file
                    fs.writeFile('app/data/farmGate/prod_rice.json', JSON.stringify(newRiceData), 'utf8',
                        function(err) {
                            console.log(err);
                        }
                    )
                    req.flash('success_msg', `New Product posted for ${district} Farm Gate successfully`);
                    break;

                    // cassava case
                case 'Cassava':
                    if (checkDistrict(newCassavaData, district)) {
                        var index = newCassavaData.findIndex((data => data.district === district))
                        newCassavaData[index].price = price
                            // newCassavaData[index].price += price

                    } else {
                        newCassavaData.push({ district, price });
                    }

                    // writing to the cassava json file
                    fs.writeFile('app/data/farmGate/prod_cassava.json', JSON.stringify(newCassavaData), 'utf8',
                        function(err) {
                            console.log(err);
                        }
                    )
                    req.flash('success_msg', `New Product posted for ${district} Farm Gate successfully`);

                    break;

                    // palmoil case
                case 'Palmoil':
                    if (checkDistrict(newPalmoilData, district)) {
                        var index = newPalmoilData.findIndex((data => data.district === district))
                        newPalmoilData[index].price = price
                            // newPalmoilData[index].price += price

                    } else {
                        newPalmoilData.push({ district, price });
                    }

                    // writing to the palmoil json file
                    fs.writeFile('app/datafarmGate/prod_palmoil.json', JSON.stringify(newPalmoilData), 'utf8',
                        function(err) {
                            console.log(err);
                        }
                    )
                    req.flash('success_msg', `New Product posted for ${district} Farm Gate successfully`);

                    break;

                    // cacao case
                case 'Cacao':
                    if (checkDistrict(newCacaoData, district)) {
                        var index = newCacaoData.findIndex((data => data.district === district))
                        newCacaoData[index].price = price
                            // newCacaoData[index].price += price

                    } else {
                        newCacaoData.push({ district, price });
                    }

                    // writing to the cacao json file
                    fs.writeFile('app/data/farmGate/prod_cacao.json', JSON.stringify(newCacaoData), 'utf8',
                        function(err) {
                            console.log(err);
                        }
                    )
                    req.flash('success_msg', `New Product posted for ${district} Farm Gate successfully`);

                    break;

                    // coffee case
                case 'Coffee':
                    if (checkDistrict(newCoffeeData, district)) {
                        var index = newCoffeeData.findIndex((data => data.district === district))
                        newCoffeeData[index].price = price
                            // newCoffeeData[index].price += price

                    } else {
                        newCoffeeData.push({ district, price });
                    }

                    // writing to the coffee json file
                    fs.writeFile('app/data/farmGate/prod_coffee.json', JSON.stringify(newCoffeeData), 'utf8',
                        function(err) {
                            console.log(err);
                        }
                    )
                    req.flash('success_msg', `New Product posted for ${district} Farm Gate successfully`);

                    break;

                    // maize case
                case 'Maize':
                    if (checkDistrict(newMaizeData, district)) {
                        var index = newMaizeData.findIndex((data => data.district === district))
                        newMaizeData[index].price = price
                            // newMaizeData[index].price += price

                    } else {
                        newMaizeData.push({ district, price });
                    }

                    // writing to the coffee json file
                    fs.writeFile('app/data/farmGate/prod_maize.json', JSON.stringify(newMaizeData), 'utf8',
                        function(err) {
                            console.log(err);
                        }
                    )
                    req.flash('success_msg', `New Product posted for ${district} Farm Gate successfully`);

                    break;

                    // sweet potato case
                case 'Sweet Potato':
                    if (checkDistrict(newSweetpotatoData, district)) {
                        var index = newSweetpotatoData.findIndex((data => data.district === district))
                        newSweetpotatoData[index].price = price
                            // newSweetpotatoData[index].price += price

                    } else {
                        newSweetpotatoData.push({ district, price });
                    }

                    // writing to the cacao json file
                    fs.writeFile('app/data/farmGate/prod_sweetpotato.json', JSON.stringify(newSweetpotatoData), 'utf8',
                        function(err) {
                            console.log(err);
                        }
                    )
                    req.flash('success_msg', `New Product posted for ${district} Farm Gate successfully`);

                    break;

                    // groundnut case
                case 'Groundnut':
                    if (checkDistrict(newGroundnutData, district)) {
                        var index = newGroundnutData.findIndex((data => data.district === district))
                        newGroundnutData[index].price = price
                            // newGroundnutData[index].price += price

                    } else {
                        newGroundnutData.push({ district, price });
                    }

                    // writing to the coffee json file
                    fs.writeFile('app/data/farmGate/prod_groundnut.json', JSON.stringify(newGroundnutData), 'utf8',
                        function(err) {
                            console.log(err);
                        }
                    )
                    req.flash('success_msg', `New Product posted for ${district} Farm Gate successfully`);

                    break;

                default:
                    console.log("input a product");
                    break;
            }

            req.flash('success_msg', 'You have posted a new market data');
            res.redirect('/admin/createMarketData'); //redirecting to the create market page
            // res.render('partials/admin/forms/marketForm');
            // res.render('partials/admin/forms/marketForm', {
            //   pageTitle: "postMarketData",
            //   pageID: "postMarketData"
            // });
        } // closing else brace

    },

    //create farmer data get controller
    farmerDisDataGet: (req, res) => {
        // rendering the page
        res.render('partials/admin/forms/farmerDisForm', {
            pageTitle: "PostFarmerDisData",
            pageID: "postfarmerdisdata",
            adminUser: req.user
        });
    },

    // this is the farmer by district data post
    farmerDisDataPost: (req, res) => {

        //this variable will be used to validate data
        var errors = req.validationErrors();

        // checking if an error occur
        if (errors) {
            res.render('partials/admin/forms/farmerDisForm', {
                errors: errors,
                adminUser: req.user
            });
        } else {
            //     function checkDistrict(alldistricts, district) {
            //         return alldistricts.some(function(el) {
            //             return el.district === district;
            //         });
            //     }
            //     //instantiating variables ;
            //     var district = req.body.district.toUpperCase();
            //     var nofarmers = parseInt(req.body.nofarmers);
            //     var newFarmerdate = [...farmerDisApiData]
            //     console.log(newFarmerdate)

            //     if (checkDistrict(newFarmerdate, district)) {
            //         var index = newFarmerdate.findIndex((data => data.district === district))
            //         newFarmerdate[index].nofarmers += nofarmers

            //     } else {
            //         newFarmerdate.push({ district, nofarmers });
            //     }

        }

        // // farmerDisApiData.unshift({ district, nofarmers }); //posting the data into the api

        // fs.writeFile('app/data/farmerDisApi.json', JSON.stringify(newFarmerdate), 'utf8',
        //     function(err) {
        //         console.log(err);
        //     }
        // )

        // req.flash('success_msg', 'You have posted a new Farmer by District data');
        // // res.redirect('/admin/createMarketData'); //redirecting to the create market page
        // // res.redirect('/admin/farmerDisData');
        // res.render('partials/admin/forms/farmerDisForm', {adminUser: req.user});

        // console.log(` check out this ${farmerDisApiData.district}`);

    },

    // create market district data get controller
    marketDistrictDataGet: (req, res) => {

        // rendering the page
        res.render('partials/admin/forms/marketForm', {
            pageTitle: "postMarketData",
            pageID: "postMarketData",
            adminUser: req.user
        });
    },

    // create market district data post  controller
    marketDistrictDataPost: (req, res) => {

        // this variable will be used to validate
        var errors = req.validationErrors();

        // checking if an error occurs
        if (errors) {
            res.render('partials/admin/forms/marketForm', {
                errors: errors,
                adminUser: req.user
            });
        } else {

            function checkProduct(allproducts, product) {
                return allproducts.some(function(el) {
                    return el.product === product;
                });
            }

            //instantiating variables ;
            // var district = req.body.district.toUpperCase();
            var product = req.body.product.toUpperCase();
            var price = parseInt(req.body.price);
            var newMarketProductData = [...marketAPIData]
            console.log(newMarketProductData)

            if (checkProduct(newMarketProductData, product)) {
                var index = newFarmerdate.findIndex((data => data.product === product))
                newMarketProductData[index].product += product

            } else {
                newMarketProductData.push({ district, product });
            }

            marketAPIData.unshift({ district, product, price }); //posting the data into the api

            fs.writeFile('app/data/marketData.json', JSON.stringify(marketAPIData), 'utf8',
                function(err) {
                    console.log(err);
                }
            )

            req.flash('success_msg', 'You have posted a new market data');
            res.redirect('/admin/createMarketData'); //redirecting to the create market page
            // res.render('partials/admin/forms/marketForm');
        } //error closing else brace

    },

    // availableProductForm get  controller
    availableProductFormGet: (req, res) => {

        // rendering the page
        res.render('partials/admin/forms/availableProductForm', {
            pageTitle: "availableProductForm",
            pageID: "availableProductForm",
            adminUser: req.user
        });
    },

    // availableProductByDistFormPost post  controller
    availableProductByDistFormPost: (req, res) => {

        // fetching the data from the form
        const { product } = req.body
        const { quantity } = req.body
        const { district } = req.body

        // this variable will be used to validate
        var errors = req.validationErrors();

        // checking if an error occurs
        if (errors) {
            res.render('partials/admin/forms/availableProductForm', {
                pageTitle: "availableProductForm",
                pageID: "availableProductForm",
                errors: errors,
                adminUser: req.user
            });
        } else {
            // creating a new poject of the avaProdPerDistModel
            newAvaProdPerDistModel = new avaProdPerDistModel({
                district: district,
                products: [{
                    name: product,
                    quantity: quantity
                }]
            });

            // check if the district name already exist
            avaProdPerDistModel.findOne({ district: district })
                .exec()
                .then(district => {
                    if (district) {

                        // update the district with the new product and quantity
                        avaProdPerDistModel.updateOne({ _id: district._id }, {
                                // Using $push with the $each modifier to append multiple values to the array field.
                                $push: {
                                    products: {
                                        $each: [{
                                            name: product,
                                            quantity: quantity
                                        }]
                                    }
                                }
                            })
                            .then(product => {
                                console.log(product);
                                req.flash('success_msg', `New Product posted for ${product.district} district successfully`);
                                res.render('partials/admin/forms/availableProductForm', { adminUser: req.user });
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    } else {
                        // saving the new record
                        newAvaProdPerDistModel.save()
                            .then(product => {
                                console.log(product);
                                req.flash('success_msg', `New Product posted for ${product.district} district successfully`);
                                res.redirect('/admin/post/new/product');
                                //res.render('partials/admin/forms/availableProductForm');
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    }
                }) // end of then else
                .catch(err => {
                    console.log(err);
                });

        } // end of esle brace
    },

    // available product for sale Post controller
    availableProductForSaleFormPost: (req, res) => {
        // getting the variables
        const { product } = req.body;
        const { fbo } = req.body;
        const { district } = req.body;

        // this variable will be used to validate
        var errors = req.validationErrors();

        // // checking if an error occurs
        if (errors) {
            res.render('partials/admin/forms/availableProductForm', {
                errors: errors,
                adminUser: req.user,
                product,
                district,
                fbo
            });
        } else {
            let filename = ''; // will hold the uploaded file

            // if uploaded file is not empty
            if (!isEmpty(req.files)) {
                let file = req.files.uploadedFile;
                filename = file.name;
                let uploadDir = './app/public/images/availableProducts/';

                file.mv(uploadDir + filename, (err) => {
                    if (err)
                        console.log(err);
                });
            }
            // instantiating a new avaProductForSaleModel
            var newAvaProductForSaleModel = new avaProductForSaleModel({
                product: product,
                fbo: fbo,
                district: district,
                photo: `/images/availableProducts/${filename}`

            });
            // saving the newAvaProductForSaleModel detail
            newAvaProductForSaleModel.save()
                .then(product => {
                    console.log(product);
                    req.flash('success_msg', 'New product posted successfully');
                    res.render('partials/admin/forms/availableProductForm', { adminUser: req.user });
                })
                .catch(err => {
                    console.log(err);
                });
        }


    },

    // registered fbos get controller
    fbosRecordsGet: (req, res) => {
        // fetching all the cbos from the farmer model
        farmerModel.find().sort({ '_id': -1 })
            .then(fbo => {
                res.render('partials/admin/tables/fbosRecordTable', { adminUser: req.user, fbo: fbo });
            })
            .catch(err => {
                console.log(err);
            });
    },

    // registered fbos get controller
    fbosRecordEditGet: (req, res) => {
        const id = req.params.id;
        // fetching all the cbos from the farmer model
        farmerModel.findById(id)
            .then(fbo => {
                res.render('partials/admin/main/editFBORecord', { adminUser: req.user, fbo: fbo });
            })
            .catch(err => {
                console.log(err);
            });
    },

    // enumerator update post controller
    fboUpdateRecordPost: (req, res) => {
        const id = req.params.id;
        // fetching all the fbo from the farmers model
        farmerModel.findById(id)
            .then(fbo => {
                // re-assigning the new data to the existing one
                fbo.executive_head_name = req.body.execHeadName;
                fbo.executive_head_address = req.body.execHeadAddress;
                fbo.executive_head_tele = req.body.execHeadTele;
                fbo.executive_head_email = req.body.execHeadEmail;

                // saving the data
                fbo.save().then(updatedFbo => {
                    req.flash('success_msg', `The FBO Head ${updatedFbo.fbo_name} details has been updated`);
                    res.redirect('/admin/records/fbos');
                });

            })
            .catch(err => {
                console.log(err);
            });
    },

    // fbos delete controller
    fbosRecordsDelete: (req, res) => {
        const id = req.params.id;
        farmerModel.findByIdAndDelete(id)
            .then(fbo => {
                req.flash('success_msg', `FBO " ${fbo.fbo_name} " was deleted successfully.`);
                res.redirect('/admin/records/fbos');
            })
            .catch(err => {
                console.log(err);
            });
    },

    // enumerators get controller
    enumeratorsRecordsGet: (req, res) => {
        // fetching all the enumerators from the enumerators model
        enumeratorsModel.find().sort({ '_id': -1 })
            .then(enumerator => {
                res.render('partials/admin/tables/enumeratorsRecordTable', { adminUser: req.user, enumerator: enumerator });
            })
            .catch(err => {
                console.log(err);
            });
    },

    // enumerators delete controller
    enumeratorsRecordsDelete: (req, res) => {
        const id = req.params.id;
        enumeratorsModel.findByIdAndDelete(id)
            .then(enumerator => {
                req.flash('success_msg', `Enumerator " ${enumerator.username} " was deleted successfully.`);
                res.redirect('/admin/records/enumerators');
            })
            .catch(err => {
                console.log(err);
            });
    },

    // enumerator edit get controller
    enumeratorEditRecordGet: (req, res) => {
        const id = req.params.id;
        // fetching all the cbos from the farmer model
        enumeratorsModel.findById(id)
            .then(enumerator => {
                res.render('partials/admin/main/editEnumeratorRecord', { adminUser: req.user, enumerator: enumerator });
            })
            .catch(err => {
                console.log(err);
            });
    },

    // enumerator update post controller
    enumeratorUpdateRecordPost: (req, res) => {
        const id = req.params.id;
        // fetching all the enumerator from the enumerators model
        enumeratorsModel.findById(id)
            .then(enumerator => {
                // re-assigning the new data to the existing one
                enumerator.firstName = req.body.regFirstName;
                enumerator.lastName = req.body.regLastName;
                enumerator.username = req.body.regUsername;
                enumerator.email = req.body.regEmail;
                enumerator.gender = req.body.gender;
                enumerator.address = req.body.regStAddress;
                enumerator.phone = req.body.regPhone;
                enumerator.city = req.body.regCity;
                enumerator.state = req.body.regState;

                // saving the data
                enumerator.save().then(updatedEnumerator => {
                    req.flash('success_msg', `Enumerator " ${updatedEnumerator.firstName} " details has been updated`);
                    res.redirect('/admin/records/enumerators');
                });

            })
            .catch(err => {
                console.log(err);
            });
    },

    // about get controllers
    aboutGet: (req, res) => {

        // fetching the about content from the about model
        aboutModel.find()
            .then(data => {
                console.log(data);
                // res.render('partials/admin/forms/aboutForm', {
                //     pageTitle: "about-page",
                //     pageID: "about-page",
                //     fetchedAbout: data,
                //     adminUser: req.user
                // });
            })
            .catch(err => {
                console.log(err);
            });
    },

    // about edit get controllers
    aboutEditGet: (req, res) => {

        // fetching the about content from the about model
        aboutModel.find()
            .then(fetchedAbout => {
                res.render('partials/admin/forms/aboutEditForm', {
                    pageTitle: "about-page",
                    pageID: "about-page",
                    fetchedAbout: fetchedAbout,
                    adminUser: req.user
                });
            })
            .catch(err => {
                console.log(err);
            });
    },

    // about edit post controller
    aboutEditPost: (req, res) => {

        // getting the variables
        const { about_heading, about_content } = req.body;

        // getting the id of the about
        const id = req.params.id;

        // error arrays
        let errors = [];

        // check required fields
        if (!about_content) {
            errors.push({ msg: 'Please fill in the content field before publising' });
        }

        // check if we do have some errors
        if (errors.length > 0) {
            // re-render the page
            res.render('partials/admin/forms/aboutEditForm', {
                pageTitle: "about-page",
                pageID: "about-page",
                adminUser: req.user,
                errors,
                about_heading,
                about_content
            });
        } else {

            // finding the about with the id
            aboutModel.findById(id)
                .then(about => {
                    about.title = req.body.about_heading,
                        about.content = req.body.about_content

                    // saving the data
                    about.save()
                        .then(about => {
                            req.flash('success_msg', 'About Content Updated');
                            res.redirect('/admin/about/edit/about._id');
                            console.log(about);
                        });
                })
                .catch(err => {
                    console.log(err);
                });
        }

    },

    // learning get controller
    learningGet: (req, res) => {
        // fetching the data from the database
        learningModel.find()
            .then(info => {
                res.render('partials/admin/forms/learningMaterialsForm', {
                    pageTitle: "learning-page",
                    pageID: "learning-page",
                    learningInfo: info,
                    adminUser: req.user
                });
            });
    },

    // learning post controller
    learningPost: (req, res) => {
        // getting the variables
        const { info_heading, info_content } = req.body;

        // getting the id of the about
        const id = req.params.id;

        // error arrays
        let errors = [];

        // check required fields
        if (!info_heading || !info_content) {
            errors.push({ msg: 'Please fill in the fields before publising' });
        }

        // check if we do have some errors
        if (errors.length > 0) {
            // re-render the page
            res.render('partials/admin/forms/learningMaterialsForm', {
                pageTitle: "learning-page",
                pageID: "learning-page",
                adminUser: req.user,
                errors,
                info_heading,
                info_content
            });
        } else {

            var newLearningModel = new learningModel({
                title: req.body.info_heading,
                content: req.body.info_content
            });

            // check if the district name already exist
            learningModel.findOne({ title: info_heading })
                .then(info => {
                    if (info) {
                        req.flash('error_msg', `An info with the title ${info.title} already exist`);
                        res.redirect('/admin/learning-info');

                    } else {
                        // saving the data
                        newLearningModel.save()
                            .then(info => {
                                req.flash('success_msg', 'New Learning Material Posted');
                                res.redirect('/admin/learning-info');
                                console.log(info);
                            });
                    }
                });
        }
    },

    // learning delete controller
    learningDelete: (req, res) => {
        const id = req.params.id;
        learningModel.findByIdAndDelete(id)
            .then(info => {
                req.flash('success_msg', `Learning information title " ${info.title} " was deleted.`);
                res.redirect('/admin/learning-info');
            })
            .catch(err => {
                console.log(err);
            });
    },

    // learning edit get controller
    learningEditRecordGet: (req, res) => {
        const id = req.params.id;
        // fetching all the learning materials from the learning model
        learningModel.findById(id)
            .then(info => {
                res.render('partials/admin/forms/learningMaterialsEditForm', { adminUser: req.user, fetchedInfo: info });
            })
            .catch(err => {
                console.log(err);
            });
    },

    // learning update post controller
    learningUpdateRecordPost: (req, res) => {
        const id = req.params.id;
        // fetching all the learning info
        learningModel.findById(id)
            .then(info => {
                // re-assigning the new data to the existing one
                info.title = req.body.info_heading;
                info.content = req.body.info_content;

                // saving the data
                info.save()
                    .then(updatedInfo => {
                        req.flash('success_msg', 'Learning Information update successfully');
                        res.redirect('/admin/learning-info');
                    });
            })
            .catch(err => {
                console.log(err);
            });
    }

};