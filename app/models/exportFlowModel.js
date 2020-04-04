var mongoose = require('mongoose');

var exportFlowSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    products: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    tonage: {
        type: Number,
        required: true
    },
    value: {
        type: Number,
    },
    district: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    districtFrom: {
        type: String,
        required: true
    },
    countryTO: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }

});

module.exports = mongoose.model('exportFlowData', exportFlowSchema);