var mongoose = require('mongoose');
var Schema = mongoose.Schema

var tradeFlowSchema = new Schema({
    product: {
        type: String,
    },
    tonage: {
        type: String,
    },
    value: {
        type: String,
    },
    enumerator: {
        type: String,
        required: true
    },
    locality_from: {
        type: String,
        required: true
    },
    chiefdom_from: {
        type: String
    },
    district_from: {
        type: String,
    },
    locality_to: {
        type: String,
    },
    chiefdom_to: {
        type: String
    },
    district_to: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now()
    }

});

var tradeFlowData = mongoose.model('tradeFlowData', tradeFlowSchema);
module.exports = tradeFlowData