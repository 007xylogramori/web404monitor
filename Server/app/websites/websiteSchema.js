const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    userId:{
        type: mongoose.Types.ObjectId,
        required:true,
        ref: "User"
    },
    isActive:{
        type:Boolean
    },
    isMonitoring:{
      type:Boolean,
      default:true,
    }
    
  },
  { timestamps: true }
);

const websiteSchema = mongoose.model("Website", schema);

module.exports = websiteSchema;
