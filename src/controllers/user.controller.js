const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { userService } = require("../services");
const unlinkImages = require("../common/unlinkImage");

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "User Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: user,
    })
  );
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "role", "gender"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await userService.queryUsers(filter, options);
  res.status(httpStatus.OK).json(
    response({
      message: "All Users",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

const getProfile = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user.id);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "The account is deleted");
  }

  if (user.isBlocked) {
    throw new ApiError(httpStatus.NOT_FOUND, "The account is blocked");
  }

  const { securitySettings } = user;

  res.status(httpStatus.OK).json(
    response({
      message: "User Profile",
      status: "OK",
      statusCode: httpStatus.OK,
      data: { user, securitySettings },
    })
  );
});

const getUser = catchAsync(async (req, res) => {
  let user = await userService.getUserById(req.params.userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  res.status(httpStatus.OK).json(
    response({
      message: "User",
      status: "OK",
      statusCode: httpStatus.OK,
      data: user,
    })
  );
});

const updateUser = catchAsync(async (req, res) => {
  if (req.body.interest) {
    const parsedInterest = JSON.parse(req.body.interest);
    req.body.interest = parsedInterest;
  }
  const image = {};
  console.log(req.file);
  if (req.file) {
    image.url = "/uploads/users/" + req.file.filename;
    image.path = req.file.path;
  }
  if (req.file) {
    req.body.image = image;
  }

  const user = await userService.updateUserById(req.params.userId, req.body);

  res.status(httpStatus.OK).json(
    response({
      message: "User Updated",
      status: "OK",
      statusCode: httpStatus.OK,
      data: user,
    })
  );
});

const updateProfile = catchAsync(async (req, res) => {


  console.log(req.files);

  if (req.files.image) {
    req.body.image = `/uploads/users/${req.files.image[0].filename}`;
  }
  if (req.files.myCv) {
    req.body.myCv = `/uploads/users/${req.files.myCv[0].filename}`;
  }
  if (req.files.portfolio) {
    req.body.portfolio = `/uploads/users/${req.files.portfolio[0].filename}`;
  }

  // Set fullName if firstName or lastName is provided
  if (!req.body.fullName && (req.body.firstName || req.body.lastName)) {
    req.body.fullName = `${req.body.firstName || ''} ${req.body.lastName || ''}`.trim();
  }


  console.log(req.body);

  const user = await userService.updateUserById(req.user.id, req.body);

  res.status(httpStatus.OK).json(
    response({
      message: "User Updated",
      status: "OK",
      statusCode: httpStatus.OK,
      data: user,
    })
  );
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.OK).json(
    response({
      message: "User Deleted",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {},
    })
  );
});

const followCompany = catchAsync(async (req, res) => {
  const { _id: userId } = req.user;
  if (!userId) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  const { companyId } = req.body;
  const user = await userService.followCompany(userId, companyId);
  res.status(httpStatus.OK).json(
    response({
      message: "User Updated",
      status: "OK",
      statusCode: httpStatus.OK,
      data: user,
    })
  );
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  getProfile,
  updateUser,
  updateProfile,
  deleteUser,
  followCompany
};
