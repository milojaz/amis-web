var mongoose = require('mongoose');
var Schema = mongoose.Schema

var marketSchema = new Schema({
    mktLocality: {
        type: String,
        required: true
    },
    mktChiefdom: {
        type: String
    },
    mktDistrict: {
        type: String,
    },
    mktRegion: {
        type: String,
    },
    marketPlace: {
        type: String,
    },
    marketType: {
        type: String,
    },
    mktEnumerator: {
        type: String,
        required: true
    },
    mktProductCategory: {
        type: String
    },
    mktProductName: {
        type: String,
    },
    WHS_Unit: {
        type: String,
    },
    WHS_Weight: {
        type: Number,
    },
    WHS_Price: {
        type: Number,
    },
    RET_Unit: {
        type: String,
    },
    RET_Weight: {
        type: Number,
    },
    RET_Price: {
        type: Number,
    },
    FG_Unit: {
        type: String,
    },
    FG_Weight: {
        type: Number,
    },
    FG_Price: {
        type: Number,
    },
    date: {
        type: Date,
        default: Date.now()
    },


});

var MarketData = mongoose.model('MarketData', marketSchema);
module.exports = MarketData