import { cache } from "../../config/node-cache";
import { University } from "../../models/admin/university.model";
import { createUniversitySchema } from "../../schemas/universitySchema";
import { ApiError, ApiSuccess } from "../../utils/apiResponse";
import { dbHandler } from "../../utils/dbHandler";
import { isValidObjectId } from "mongoose";
import { CustomerDetails } from "../../models/customer/custumerDetails.model";
import { CurrentPursuing } from "../../models/admin/currentPursuing.model";
import { Semester } from "../../models/admin/semester.model";
import { Subject } from "../../models/admin/subject.model";
import fs from "fs";

export const createUniversity = dbHandler(async (req, res) => {
  const { success, data, error } = createUniversitySchema.safeParse(
    req.body
  );

  const logoPath = req.file?.path;

  if (!success) throw new ApiError(400, "Invalid data", error.errors);

  const adminId = req.admin?._id;

  if (!adminId) throw new ApiError(400, "Admin id is required");

  const university = await University.create({
    universityName: data.universityName,
    universityLogo: logoPath ?? undefined,
    adminId,
  });

  if (!university) throw new ApiError(400, "Could not create university");

  res.status(201).json(new ApiSuccess("University created", university));
});

export const getAllUniversities = dbHandler(async (req, res) => {
  const adminId = req.admin?._id;
  const customerId = req.customer?._id;

  if (!adminId && !customerId)
    throw new ApiError(400, "Admin or Customer id is required");

  const cacheKey = `universities-list`;

  if (cache.has(cacheKey)) {
    const cachedUniversities = cache.get(cacheKey);

    return res
      .status(200)
      .json(new ApiSuccess("All universities", cachedUniversities));
  }

  const universities = await University.find({
    isDeleted: false,
  }).select("-currentPursuing");

  if (!universities)
    throw new ApiError(400, "Could not get all universities");
});

export const getUniversityById = dbHandler(async (req, res) => {
  const universityId = req.params.universityId;
  const customerId = req.admin?._id;
  const adminId = req.admin?._id;

  if (!adminId && !customerId)
    throw new ApiError(400, "Admin or Customer id is required");

  if (!isValidObjectId(universityId))
    throw new ApiError(400, "Invalid University id");

  const cacheKey = `university-${universityId}`;

  if (cache.has(cacheKey)) {
    const cachedUniversity = cache.get(cacheKey);

    return res
      .status(200)
      .json(
        new ApiSuccess("University fetched successfully", cachedUniversity)
      );
  }

  const university = await University.findById(universityId);

  if (!university) throw new ApiError(404, "University not found");

  cache.set(cacheKey, university);

  res
    .status(200)
    .json(new ApiSuccess("University fetched successfully", university));
});

export const updateUniversity = dbHandler(async (req, res) => {
  const { success, data, error } = createUniversitySchema.safeParse(
    req.body
  );

  if (!success) throw new ApiError(400, "Invalid data", error.errors);

  const universityId = req.params.universityId;
  const adminId = req.admin?._id;

  if (!adminId) throw new ApiError(401, "Unauthorized request");

  if (!isValidObjectId(universityId))
    throw new ApiError(400, "Invalid id");

  const logoPath = req.file?.path;

  const university = await University.findById(universityId);

  if (!university) throw new ApiError(404, "University not found");

  if (university.isDeleted)
    throw new ApiError(400, "University is deleted");

  if (university.adminId.toString() !== adminId.toString())
    throw new ApiError(401, "Unauthorized request");

  university.universityName = data.universityName;

  if (logoPath) {
    const oldLogoPath = university.universityLogo;

    if (oldLogoPath && fs.existsSync(oldLogoPath))
      try {
        fs.unlinkSync(oldLogoPath);
      } catch (error) {
        console.error("Error deleting old logo:", error);
      }

    university.universityLogo = logoPath;
  }

  const updatedUniversity = await university.save();

  if (!updatedUniversity)
    throw new ApiError(400, "Could not update university");

  const universityCacheKey = `university-${universityId}`;
  const allUniversitiesCacheKey = `universities-list`;

  if (cache.has(universityCacheKey)) cache.del(universityCacheKey);
  if (cache.has(allUniversitiesCacheKey))
    cache.del(allUniversitiesCacheKey);

  res
    .status(200)
    .json(new ApiSuccess("University updated", updatedUniversity));
});

export const deleteUniversity = dbHandler(async (req, res) => {
  const universityId = req.params.universityId;
  const adminId = req.admin?._id;

  if (!isValidObjectId(universityId))
    throw new ApiError(400, "Invalid id");

  if (!adminId) throw new ApiError(401, "Unauthorized request");

  const university = await University.findOneAndUpdate(
    {
      _id: universityId,
      adminId: adminId,
      isDeleted: false,
    },
    {
      isDeleted: true,
    },
    {
      new: true,
    }
  );

  if (!university) throw new ApiError(400, "Could not delete university");

  const currentPursuingList = await CurrentPursuing.find({
    universityId: universityId,
  });

  if (currentPursuingList.length > 0) {
    for (const currentPursuing of currentPursuingList) {
      currentPursuing.isDeleted = true;
      await currentPursuing.save();

      const semesterList = await Semester.find({
        _id: { $in: currentPursuing.semesters },
      });

      if (semesterList.length > 0) {
        for (const semester of semesterList) {
          semester.isDeleted = true;
          await semester.save();

          await Subject.updateMany(
            {
              _id: { $in: semester.subjects },
            },
            {
              $set: { isDeleted: true },
            }
          );
        }
      }
    }
  }

  CustomerDetails.updateMany(
    {
      universityId: universityId,
    },
    { isDeleted: true }
  );

  const universityCacheKey = `university-${universityId}`;
  const allUniversitiesCacheKey = `universities-list`;

  if (cache.has(universityCacheKey)) cache.del(universityCacheKey);
  if (cache.has(allUniversitiesCacheKey))
    cache.del(allUniversitiesCacheKey);

  res
    .status(200)
    .json(new ApiSuccess("University deleted", allUniversitiesCacheKey));
});
