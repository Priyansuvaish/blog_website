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

// Utility functions for efficient operations
export const BlogSubscriberUtils = {
  async isEmailSubscribed(email: string): Promise<boolean> {
    try {
      const normalizedEmail = email.toLowerCase().trim();
      const subscriber = await BlogSubscribers.findOne({ email: normalizedEmail });
      return !!subscriber;
    } catch (error) {
      console.error('Error checking email subscription:', error);
      throw error;
    }
  },

  async subscribeEmail(email: string): Promise<{ success: boolean; message: string; alreadySubscribed?: boolean }> {
    try {
      const normalizedEmail = email.toLowerCase().trim();
      
      // Check if email already exists
      const existingSubscriber = await BlogSubscribers.findOne({ email: normalizedEmail });
      
      if (existingSubscriber) {
        return {
          success: true,
          message: 'Email is already subscribed to our newsletter',
          alreadySubscribed: true
        };
      }

      // Create new subscriber
      const newSubscriber = new BlogSubscribers({ email: normalizedEmail });
      await newSubscriber.save();

      return {
        success: true,
        message: 'Successfully subscribed to our newsletter!',
        alreadySubscribed: false
      };
    } catch (error) {
      console.error('Error subscribing email:', error);
      throw error;
    }
  },

  async updateSubscriberEmail(oldEmail: string, newEmail: string): Promise<{ success: boolean; message: string; alreadySubscribed?: boolean }> {
    try {
      const normalizedOldEmail = oldEmail.toLowerCase().trim();
      const normalizedNewEmail = newEmail.toLowerCase().trim();
      
      // Check if new email already exists
      const existingSubscriber = await BlogSubscribers.findOne({ email: normalizedNewEmail });
      
      if (existingSubscriber) {
        return {
          success: false,
          message: 'New email is already subscribed to our newsletter',
          alreadySubscribed: true
        };
      }

      // Find and update the subscriber
      const updatedSubscriber = await BlogSubscribers.findOneAndUpdate(
        { email: normalizedOldEmail },
        { email: normalizedNewEmail },
        { new: true }
      );

      if (!updatedSubscriber) {
        // If old email not found, create new subscription
        return await this.subscribeEmail(newEmail);
      }

      return {
        success: true,
        message: 'Email successfully updated!',
        alreadySubscribed: false
      };
    } catch (error) {
      console.error('Error updating subscriber email:', error);
      throw error;
    }
  }
};

export default BlogSubscribers; 