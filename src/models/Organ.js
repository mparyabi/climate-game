import mongoose from "mongoose";

const OrganSchema = new mongoose.Schema({
link:{
    type:String,
    required:true,
    unique:true
  },
name: {
    type:String,
    required: true
} ,
gamePrice: {
    type:Number,
    default: 0
},
discountValue:{
    type:Number,
    default: 0
},
startDate:{
  type:Date,
  default: Date.now
},
endDate:{
  type:Date,
  required:true
}
}, { timestamps: true });

export default mongoose.models.Organ ||
  mongoose.model("Organ", OrganSchema);
