import mongoose, { Schema, Types } from 'mongoose';

export interface ILayout {
    garden: Types.ObjectId;
    name: string;
    width: number;
    height: number;
    units: 'metric' | 'empirial';
    data: Array<object>;
}

const LayoutSchema = new Schema({
    garden: {
        type: Schema.Types.ObjectId,
        ref: "Garden",
        required: true
    },
    name: {
        type: String,
        required: [true, 'Name is required.']
    },
    width: {
        type: Number,
        required: [true, 'Width is required.'],
        min: 3,
        max: 1000
    },
    height: {
        type: Number,
        required: [true, 'Heigh is required.'],
        min: 3,
        max: 1000
    },
    units: {
        type: String,
        enum: ['metric', 'empirial'],
        default: 'metric'
    },
    layoutData: {
        type: Array
    }
}, {timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

const Layout = mongoose.models.Layout || mongoose.model<ILayout>('Layout', LayoutSchema);

export default Layout;