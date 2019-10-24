module.exports = {
    isEmpty: function(obj){
        for(let key in obj) {
            if(obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    },
    isUserAuthenticated: (req, res, next) =>{
        if(req.isAuthenticated()) {
            return next();
        }else{
            req.flash('error_msg', 'Please log in to access resource');
            res.redirect('/admin');
        }
    }
};