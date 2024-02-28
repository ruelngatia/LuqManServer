import mongoose from "mongoose";

const { Schema } = mongoose

const StorySchema = new Schema({
    user_id: {
        type: String,
        ref: 'User',
        required: true
    },
    story: {
        type: String,
    }
})

const Story = mongoose.model('Story', StorySchema)

export default Story