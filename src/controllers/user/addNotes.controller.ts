import { ApiError, ApiSuccess } from "../../utils/apiResponse";
import { dbHandler } from "../../utils/dbHandler";
import { AddNotes } from "../../models/user/addNotes.model";
import { isValidObjectId } from "mongoose";
import { addNotesSchema } from "../../schemas/addnotes.schema";

export const getNotes = dbHandler(async (req, res) => {
  const courseId = req.params.courseId;
  const userId = req.user?._id;

  if (!isValidObjectId(courseId)) throw new ApiError("Invalid courseId");

  const addNotes = await AddNotes.find({ userId, courseId });

  if (!addNotes) throw new ApiError("AddNotes not found");

  res
    .status(200)
    .json(new ApiSuccess("AddNotes fetched successfully", addNotes));
});

export const createNote = dbHandler(async (req, res) => {
  const userId = req.user?._id;
  const courseId = req.params.courseId;

  if (!isValidObjectId(courseId)) throw new ApiError("Invalid courseId");

  const { data, success, error } = addNotesSchema.safeParse(req.body);

  if (!success) throw new ApiError(error.message);

  const addNotes = await AddNotes.create({
    userId,
    courseId,
    note: data.note,
  });

  if (!addNotes) throw new ApiError("AddNotes not found");

  res
    .status(200)
    .json(new ApiSuccess("AddNotes updated successfully", addNotes));
});

export const updateNote = dbHandler(async (req, res) => {
  const noteId = req.params.noteId;

  if (!isValidObjectId(noteId)) throw new ApiError("Invalid courseId");

  const { data, success, error } = addNotesSchema.safeParse(req.body);

  if (!success) throw new ApiError(error.message);

  const updatedNotes = await AddNotes.findByIdAndUpdate(
    noteId,
    {
      note: data.note,
    },
    {
      new: true,
    }
  );

  if (!updatedNotes) throw new ApiError("AddNotes not found");

  res
    .status(200)
    .json(new ApiSuccess("AddNotes updated successfully", updatedNotes));
});

export const deleteAddNotes = dbHandler(async (req, res) => {
  const noteId = req.params.noteId;

  if (!isValidObjectId(noteId)) throw new ApiError("Invalid courseId");

  const addNotes = await AddNotes.findByIdAndDelete(noteId);

  if (!addNotes) throw new ApiError("AddNotes not found");

  res
    .status(200)
    .json(new ApiSuccess("AddNotes deleted successfully", addNotes));
});