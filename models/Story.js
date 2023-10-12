const mongoose = require("mongoose")

const StorySchema = new mongoose.Schema({
    userid:{type:mongoose.Schema.Types.ObjectId,ref:'Profile'},
    imageLink:{type:String,required:true}
},{timestamps:true});

const Story = mongoose.model('Story',StorySchema);

module.exports = Story;