import { Wallet } from "../../models/user/wallet.models";
import { ApiError, ApiSuccess } from "../../utils/apiResponse";
import { dbHandler } from "../../utils/dbHandler";
import { isValidObjectId } from "mongoose";

export const createWallet = dbHandler(async (req, res) => {
  const userId = req.user?._id;

  const existingWallet = await Wallet.findOne({ userId });

  if (existingWallet)
    throw new ApiError("Wallet already exists for this user");

  const newWallet = await Wallet.create({ userId });

  res
    .status(201)
    .json(new ApiSuccess("Wallet created successfully", newWallet));
});

export const getWallet = dbHandler(async (req, res) => {
  const userId = req.user?._id;

  const wallet = await Wallet.findOne({ userId }).populate("transactions");

  if (!wallet) throw new ApiError("Wallet not found");

  res
    .status(200)
    .json(new ApiSuccess("Wallet fetched successfully", wallet));
});

export const updateWalletBalance = dbHandler(async (req, res) => {
  const walletId = req.params.walletId;
  const { amount } = req.body;

  if (!isValidObjectId(walletId)) throw new ApiError("Invalid wallet id");

  const wallet = await Wallet.findByIdAndUpdate(
    walletId,
    {
      $inc: { balance: amount },
    },
    {
      new: true,
    }
  );

  if (!wallet) throw new ApiError("Wallet not found");

  res
    .status(200)
    .json(new ApiSuccess("Wallet balance updated successfully", wallet));
});

export const deleteWallet = dbHandler(async (req, res) => {
  const walletId = req.params.walletId;

  if (!isValidObjectId(walletId)) throw new ApiError("Invalid wallet id");

  const wallet = await Wallet.findByIdAndDelete(walletId);

  if (!wallet) throw new ApiError("Wallet not found");

  res
    .status(200)
    .json(new ApiSuccess("Wallet deleted successfully", wallet));
});
