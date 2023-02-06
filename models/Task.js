import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            min: 2,
            max: 100,
        },
        date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ["activada", "desactivada"],
            default: "activada"
        },
        iduser: {
            type: Object,
            required: true
        }
    },
    { timestamps: true }
);

const Task = mongoose.model("Task", TaskSchema);
export default Task;