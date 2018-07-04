var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ProductSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  manufacturer: {
    type: String,
    required: true
  },

  price: {
    type: String,
    required: true
    
  },
  // `link` is required and of type String
  link: {
    type: String,
    required: true
  },
  imglink: {
    type: String,
    required: true
  },
  // `note` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the Article with an associated Note
  note: [
    {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
]
});

// This creates our model from the above schema, using mongoose's model method
var Product = mongoose.model("Product", ProductSchema);

// Export the Article model
module.exports = Product;


//houzz.com/products/flooring
//https://www.houzz.com/products/flooring/ls=2  
//https://www.houzz.com/products/wall-and-floor-tile/ls=2
//https://www.houzz.com/products/wall-and-floor-tile/p/90
//https://www.houzz.com/products/wall-and-floor-tile/p/180