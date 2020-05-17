var mongoose = require('mongoose');
var Schema = mongoose.Schema


var stockFlowSchema = new Schema({
    ttmDistrict: {
        type: String,
    },
    marketPlace: {
        type: String
    },
    ttmMarket: {
        type: String,
    },
    msuProductCategory: {
        type: String,
    },
    products: {
        type: String,
    },
    market_type: {
        type: String,
    },
    ttmPrice: {
        type: Number,
    },
    quantityStore: {
        type: Number,
    },
    quantityUnit: {
        type: String,
    },
    quantitySold: {
        type: Number,
    },
    stockLevel: {
        type: Number,
    },
    stockDestination: {
        type: String,
    },
    grandTotal: {
        type: Number,
    },
    rent: {
        type: Number,
    },
    transportCost: {
        type: Number,
    },
    electricity: {
        type: Number,
    },
    securityOwn: {
        type: Number,
    },
    securityMarketOwn: {
        type: Number,
    },
    fumigation: {
        type: Number,
    },
    chemicalTreatment: {
        type: Number,
    },
    averageCost: {
        type: Number,
    }

});

var stockFlowData = mongoose.model('stockFlowData', stockFlowSchema);
module.exports = stockFlowData