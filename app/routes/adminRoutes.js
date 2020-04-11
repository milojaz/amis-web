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

//$$$$$$$$$$$$ FROM BELOW ADD  $$$$$$$$$

// admin registration request
router.route('/register/admin')
    .get(adminController.adminRegFormGet)
    .post(adminController.adminRegFormPost);

// admin homepage route
router.route('/dashboard')
    .get(adminController.getDashboard);

// admin create posts route
router.route('/logout')
    .get(adminController.getLogout);

// admin marketDataTable route
router.route('/market')
    .get(adminController.getMarketDataTable); // 

// export flow route
router.route('/exportFlow')
    .get(adminController.exportFlowGet);

// admin tradeFlowDataTable route
router.route('/tradeFlow')
    .get(adminController.getTradeFlowDataTable); // 

// admin stockLevelDataTable route
router.route('/stockLevel')
    .get(adminController.getStockLevelDataTable);

// enumerator registration route
router.route('/register/enumerator')
    .get(adminController.enumeratorRegFormGet)
    .post(adminController.enumeratorRegFormPost);

// enumerator get router
router.route('/records/enumerators')
    .get(adminController.enumeratorsRecordsGet);

// enumerator delete route
router.route('/records/enumerators/:id')
    .get(adminController.enumeratorsRecordsDelete);

// enumerator edit routes
router.route('/records/enumerator/edit/:id')
    .get(adminController.enumeratorEditRecordGet)
    .post(adminController.enumeratorUpdateRecordPost);

// farmer registration route
router.route('/register/farmer')
    .get(adminController.farmerRegFormGet)
    .post(adminController.farmerRegFormPost);

// creat market data route
router.route('/createMarketData')
    .get(adminController.marketDataGet) // 

// wholesale post routess
router.route('/create_wholesale')
    .post(adminController.wholesaleDataPost);

// retail post routess
router.route('/create_retail')
    .post(adminController.retailDataPost);

// farmgate post routess
router.route('/create_farm_gate')
    .post(adminController.farmGateDataPost);

// creat farmer data route
// router.route('/farmerDisData')
//     .get(adminController.farmerDisDataGet) // 
//     .post(adminController.farmerDisDataPost);

// post request product view route
router.route('/post/new/product')
    .get(adminController.availableProductFormGet);

// post request product by district data route
router.route('/post/new/product/district')
    .post(adminController.availableProductByDistFormPost);

// post request available-for-sale product by district data route
router.route('/post/new/product/available')
    .post(adminController.availableProductForSaleFormPost);

// delete an order route
router.route('/order/delete/:id')
    .get(adminController.deleteOrder);

// fbo get router
router.route('/records/fbos')
    .get(adminController.fbosRecordsGet);

// fbo delete route
router.route('/records/fbos/:id')
    .get(adminController.fbosRecordsDelete);

// fbo edit route
router.route('/fbo/record/edit/:id')
    .get(adminController.fbosRecordEditGet)
    .put(adminController.fboUpdateRecordPost);

// about get and post routes
router.route('/about')
    .get(adminController.aboutGet);

// about edit post and get routes
router.route('/about/edit/:id')
    .get(adminController.aboutEditGet)
    .post(adminController.aboutEditPost);

// learning routes
router.route('/learning-info')
    .get(adminController.learningGet)
    .post(adminController.learningPost);

// learning delete route
router.route('/learning-info/delete/:id')
    .get(adminController.learningDelete);

// learning edit get route
router.route('/learning-info/edit/:id')
    .get(adminController.learningEditRecordGet)
    .post(adminController.learningUpdateRecordPost);

module.exports = router;