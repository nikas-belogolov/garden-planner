import mongoose, { Schema, Types } from 'mongoose';
import { ILayout } from './LayoutModel';

export interface IPermission {
    user: Types.ObjectId;
    role: 'viewer' | 'editor' | 'owner';
}

export interface IGarden {
    owner: Types.ObjectId;
    name: string;
    location: string;
    private: boolean;
    permissions: Array<IPermission>;
    layouts: Array<ILayout>;
}

const GardenSchema = new Schema<IGarden>({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    name: {
        type: String,
        required: [true, 'Name is required.']
    },
    
    location: {
        type: String,
        required: false
    },

    private: {
        type: Boolean,
        default: false,
    },

    // Permissions
    permissions: [
        {
            user: { type: Schema.Types.ObjectId, ref: 'User' },
            role: { type: String, enum: ['viewer', 'editor', 'owner'] }
        }
    ],

    // Layouts, Calendar, Tasks and Journal
    layouts: [{
        type: Schema.Types.ObjectId,
        ref: "Layout",
    }],

}, {timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

const Garden = mongoose.models.Garden || mongoose.model<IGarden>('Garden', GardenSchema);

export default Garden;