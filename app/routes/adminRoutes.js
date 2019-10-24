// modules
var express = require('express');
var router = express.Router();
const cors = require('cors');
var passport = require('passport');
// const bcrypt = require('bcrypt');

// configuration file
const {
    isUserAuthenticated
} = require('../config/customFunction');

// setting the cors
router.use(cors());

// controllers
const adminController = require('../controllers/adminControllers');

// models
// var adminModel = require('../models/admin_model');

// passport middleware
// var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;

// passport.use(new LocalStrategy({
//     usernameField: 'email',
//     passReqToCallback: true
// }, (req, email, password, done) => {
//     adminModel.findOne({
//             email: email
//         })
//         .then(adminUser => {
//             // if user not exist
//             if (!adminUser) {
//                 return done(null, false, req.flash('error_msg', 'Email not found'));
//             }

//             // if their is a user
//             bcrypt.compare(password, adminUser.password, (err, isMatch) => {
//                 if (err) {
//                     return err
//                 }

//                 // if password not match
//                 if (!isMatch) {
//                     return done(null, false, req.flash('error_msg', 'Invalid username or Password'));
//                 }

//                 // if the is found and valid
//                 return done(null, adminUser, req.flash('success_msg', 'Login Successful'));
//             });

//         })
//         .catch(err => {
//             console.log(err);
//         });
// }));

// passport.serializeUser((adminUser, done) => {
//     done(null, adminUser.id);
// });

// passport.deserializeUser((id, done) => {
//     adminModel.findById(id, function(err, adminUser) {
//         done(err, adminUser);
//     });
// });

// admin get request
router.route('/')
    .get(adminController.index)
    .post( // authenticating the user
        passport.authenticate('local', {
            successRedirect: '/admin/dashboard',
            failureRedirect: '/admin',
            failureFlash: true
            // successFlash: true,
            // session: true
            // , adminController.postLogin
        }));

// admin registration request
router.route('/register/admin')
    .get(isUserAuthenticated, adminController.adminRegFormGet)
    .post(isUserAuthenticated, adminController.adminRegFormPost);

// admin homepage route
router.route('/dashboard')
    .get(isUserAuthenticated, adminController.getDashboard);

// admin create posts route
router.route('/logout')
    .get(adminController.getLogout);

// admin marketDataTable route
router.route('/market')
    .get(isUserAuthenticated, adminController.getMarketDataTable); // isUserAuthenticated, 

// export flow route
router.route('/exportFlow')
    .get(isUserAuthenticated, adminController.exportFlowGet);

// admin tradeFlowDataTable route
router.route('/tradeFlow')
    .get(isUserAuthenticated, adminController.getTradeFlowDataTable); // isUserAuthenticated, 

// admin stockLevelDataTable route
router.route('/stockLevel')
    .get(isUserAuthenticated, adminController.getStockLevelDataTable);

// enumerator registration route
router.route('/register/enumerator')
    .get(isUserAuthenticated, adminController.enumeratorRegFormGet)
    .post(isUserAuthenticated, adminController.enumeratorRegFormPost);

// enumerator get router
router.route('/records/enumerators')
    .get(isUserAuthenticated, adminController.enumeratorsRecordsGet);

// enumerator delete route
router.route('/records/enumerators/:id')
    .get(isUserAuthenticated, adminController.enumeratorsRecordsDelete);

// enumerator edit routes
router.route('/records/enumerator/edit/:id')
    .get(isUserAuthenticated, adminController.enumeratorEditRecordGet)
    .post(isUserAuthenticated, adminController.enumeratorUpdateRecordPost);

// farmer registration route
router.route('/register/farmer')
    .get(isUserAuthenticated, adminController.farmerRegFormGet)
    .post(isUserAuthenticated, adminController.farmerRegFormPost);

// creat market data route
router.route('/createMarketData')
    .get(isUserAuthenticated, adminController.marketDataGet) // isUserAuthenticated, 

// wholesale post routess
router.route('/create_wholesale')
    .post(isUserAuthenticated, adminController.wholesaleDataPost);

// retail post routess
router.route('/create_retail')
    .post(isUserAuthenticated, adminController.retailDataPost);

// farmgate post routess
router.route('/create_farm_gate')
    .post(isUserAuthenticated, adminController.farmGateDataPost);

// creat farmer data route
// router.route('/farmerDisData')
//     .get(isUserAuthenticated, adminController.farmerDisDataGet) // isUserAuthenticated, 
//     .post(isUserAuthenticated, adminController.farmerDisDataPost);

// post request product view route
router.route('/post/new/product')
    .get(isUserAuthenticated, adminController.availableProductFormGet);

// post request product by district data route
router.route('/post/new/product/district')
    .post(isUserAuthenticated, adminController.availableProductByDistFormPost);

// post request available-for-sale product by district data route
router.route('/post/new/product/available')
    .post(isUserAuthenticated, adminController.availableProductForSaleFormPost);

// delete an order route
router.route('/order/delete/:id')
    .get(isUserAuthenticated, adminController.deleteOrder);

// fbo get router
router.route('/records/fbos')
    .get(isUserAuthenticated, adminController.fbosRecordsGet);

// fbo delete route
router.route('/records/fbos/:id')
    .get(isUserAuthenticated, adminController.fbosRecordsDelete);

// fbo edit route
router.route('/fbo/record/edit/:id')
    .get(isUserAuthenticated, adminController.fbosRecordEditGet)
    .put(isUserAuthenticated, adminController.fboUpdateRecordPost);

// about get and post routes
router.route('/about')
    .get(isUserAuthenticated, adminController.aboutGet);

// about edit post and get routes
router.route('/about/edit/:id')
    .get(isUserAuthenticated, adminController.aboutEditGet)
    .post(isUserAuthenticated, adminController.aboutEditPost);

// learning routes
router.route('/learning-info')
    .get(isUserAuthenticated, adminController.learningGet)
    .post(isUserAuthenticated, adminController.learningPost);

// learning delete route
router.route('/learning-info/delete/:id')
    .get(isUserAuthenticated, adminController.learningDelete);

// learning edit get route
router.route('/learning-info/edit/:id')
    .get(isUserAuthenticated, adminController.learningEditRecordGet)
    .post(isUserAuthenticated, adminController.learningUpdateRecordPost);

module.exports = router;