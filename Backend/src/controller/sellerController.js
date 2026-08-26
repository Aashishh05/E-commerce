import asyncErrorHandler from "../middleware/asyncErrorHandler.js";
import sellerService from "../services/sellerService.js";

export const createSeller = asyncErrorHandler(async (req, res) => {
  const seller = await sellerService.createSeller(req.user, req.body);

  res.status(201).json({
    success: true,
    message: "Seller profile created successfully",
    seller,
  });
});

export const getSellerProfile = asyncErrorHandler(async (req, res) => {
  const seller = await sellerService.getSellerProfile(req.user);

  res.status(200).json({
    success: true,
    message: "Seller profile fetched successfully",
    data: seller,
  });
});

export const getAllSeller = asyncErrorHandler(async (req, res) => {
  const sellers = await sellerService.getAllSellers();

  res.status(200).json({
    success: true,
    message: "All sellers fetched successfully",
    count: sellers.length,
    data: sellers,
  });
});

export const getSellerById = asyncErrorHandler(async (req, res) => {
  const seller = await sellerService.getSellerById(req.params.id);

  res.status(200).json({
    success: true,
    message: "Seller fetched successfully",
    data: seller,
  });
});

export const updateSeller = asyncErrorHandler(async (req, res) => {
  const seller = await sellerService.updateSeller(req.user, req.body);

  res.status(200).json({
    success: true,
    message: "Seller updated successfully",
    data: seller,
  });
});

export const verifySeller = asyncErrorHandler(async (req, res) => {
  const seller = await sellerService.verifySeller(
    req.params.id,
    req.body.status,
  );

  res.status(200).json({
    success: true,
    message: `Seller ${req.body.status}`,
    seller,
  });
});
