const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// load user model
const Admin = require('../models/admin_model');

// export the strategy
module.exports = function(passport) {
    
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Match User
            Admin.findOne({ email: email })
                .then(admin => {
                    // check if a user not existing
                    if(!admin) {
                        return done(null, false, { error_msg: 'That email is not registered' });
                    }

                    // match password
                    bcrypt.compare(password, admin.password, (err, isMatch) => {
                        if(err) throw err;

                        if(isMatch) {
                            return done(null, admin);
                        } else {
                            return done(null, false, { error_msg: 'Username or password is not found'});
                        }
                    });                
                })
                .catch(err => console.log(err));
        })
    );

    passport.serializeUser((admin, done) => {
        done(null, admin.id);
    });
    
    passport.deserializeUser((id, done) => {
        Admin.findById(id, (err, admin) =>{
            done(err, admin);
        });
    });
    

}