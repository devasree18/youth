import mongoose from 'mongoose';
export declare const User: mongoose.Model<{
    email: string;
    password: string;
    name: string;
    assessments: mongoose.Types.DocumentArray<{
        date: NativeDate;
        result?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        date: NativeDate;
        result?: string | null;
    }, {}, {}> & {
        date: NativeDate;
        result?: string | null;
    }>;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    email: string;
    password: string;
    name: string;
    assessments: mongoose.Types.DocumentArray<{
        date: NativeDate;
        result?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        date: NativeDate;
        result?: string | null;
    }, {}, {}> & {
        date: NativeDate;
        result?: string | null;
    }>;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    email: string;
    password: string;
    name: string;
    assessments: mongoose.Types.DocumentArray<{
        date: NativeDate;
        result?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        date: NativeDate;
        result?: string | null;
    }, {}, {}> & {
        date: NativeDate;
        result?: string | null;
    }>;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    email: string;
    password: string;
    name: string;
    assessments: mongoose.Types.DocumentArray<{
        date: NativeDate;
        result?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        date: NativeDate;
        result?: string | null;
    }, {}, {}> & {
        date: NativeDate;
        result?: string | null;
    }>;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    email: string;
    password: string;
    name: string;
    assessments: mongoose.Types.DocumentArray<{
        date: NativeDate;
        result?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        date: NativeDate;
        result?: string | null;
    }, {}, {}> & {
        date: NativeDate;
        result?: string | null;
    }>;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    email: string;
    password: string;
    name: string;
    assessments: mongoose.Types.DocumentArray<{
        date: NativeDate;
        result?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        date: NativeDate;
        result?: string | null;
    }, {}, {}> & {
        date: NativeDate;
        result?: string | null;
    }>;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    email: string;
    password: string;
    name: string;
    assessments: mongoose.Types.DocumentArray<{
        date: NativeDate;
        result?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        date: NativeDate;
        result?: string | null;
    }, {}, {}> & {
        date: NativeDate;
        result?: string | null;
    }>;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    email: string;
    password: string;
    name: string;
    assessments: mongoose.Types.DocumentArray<{
        date: NativeDate;
        result?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        date: NativeDate;
        result?: string | null;
    }, {}, {}> & {
        date: NativeDate;
        result?: string | null;
    }>;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=User.d.ts.map