const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    url: {
      type: String,
      require: true,
    },
    userId:{
        type: mongoose.Types.ObjectId,
        require:true,
        ref: "User"
    },
    isActive:{
        type:Boolean
    }
    
  },
  { timestamps: true }
);

const websiteSchema = mongoose.model("Website", schema);

module.exports = websiteSchema;
