const utilizer = async (res, error) => {
  if (error.message.includes("duplicate")) {
    return res.status(409).json({
      error: `duplicate key ${Object.keys(error.keyValue)[0]}`,
      message: `${Object.values(error.keyValue)[0]} is already in use`,
    });
  }
};

module.exports = { utilizer };
