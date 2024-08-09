import mongoose, { Document, Schema, Types } from 'mongoose';
import validator from 'validator';
const isEmail = validator.isEmail;

export interface IUser extends Document {
  email: string;
  username: string;
  gardens: Array<Types.ObjectId>;
  password: string;

  plan: Types.ObjectId;
  subscriptionExpiry: Date;
  billingID: string;
  trial: any;
}

const UserSchema: Schema = new Schema<IUser>({
  
  email:{
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    validate: [
      { validator: isEmail, message: 'Please enter a valid email.' },
      { validator: (value: string) => {
          return User.findOne({ email: value }).then((user: IUser) => {
              if (user) return Promise.resolve(false);
          })
        },
        message: 'Email is already in use.'
      }
    ]
  },

  username:{
    type: String,
    required: [true, 'Username is required.'],
    unique: true,
    minlength: 3,
    maxlength: 15,
    validate: [{
      validator: (value: string): any => {
        return User.findOne({ username: value }).then((user: any) => {
          if (user) return Promise.resolve(false);
        })
      },
      message: 'Username is already in use.'
    }, {
      validator: (value: any) => {
        const usernameRegex = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/;
        return usernameRegex.test(value);
      },
      message: () => 'Username should only contain alphanumerics, underscores, and hyphens.'
    }]
  },

  password:{
    type: String,
    required: [true, 'Password is required.'],
    minlength: 8,
    maxlength: 64,
  },

  gardens: [{ type: Schema.Types.ObjectId, ref: 'Garden' }],

  // Subscriptions
  plan: { type: Schema.Types.ObjectId, ref: 'Plan' },

  subscriptionExpiry: { type: Date },

  billingID: { type: String },

  trial: {
    active: { type: Boolean, default: false },
    expiry: { type: Date }
  }
});




const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;