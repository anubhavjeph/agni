var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CoordinateSchema   = new Schema({
	x: String,
	y: String,
	x1: String,
	y1: String,
	device: String
});

module.exports = mongoose.model('Cord', CoordinateSchema);