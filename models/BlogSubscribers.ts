import mongoose, { Schema, models } from "mongoose";

const blogSubscribersSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
    },
    { timestamps: true }
);

// Create index for better query performance
blogSubscribersSchema.index({ email: 1 });

const BlogSubscribers = models.BlogSubscribers || mongoose.model("BlogSubscribers", blogSubscribersSchema);

export default BlogSubscribers; 