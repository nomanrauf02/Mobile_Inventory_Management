const Item = require("../models/items.model");
const cron = require("node-cron");
const mongoose = require("mongoose");

const sendEmail = require("../helpers/nodeMailer/Email");

cron.schedule(" * * * * *", async () => {
  const allItems = await Item.find({});
  const modelNum = allItems.length;
  console.log("Total Stock of every Model:", modelNum);
});

const transaction = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const Id = req.params.id;
    await Item.findByIdAndUpdate(Id, { $inc: { quantity: -5 } }, { session });

    await Item.findByIdAndUpdate(Id, { $inc: { quantity: -5 } }, { session });
    // await Item.findOneAndUpdate(
    // { modelName: "iphone" },
    //   { $inc: { quantity: 8 } }
    // );

    await session.commitTransaction();
  } catch (error) {
    console.log("error occurred during the transaction");
    console.log(error);
    await session.abortTransaction();
  } finally {
    await session.endSession();
  }
};

const deleteSingle = async (req, res) => {
  try {
    const Id = req.params.id;
    const item = await Item.findByIdAndUpdate(Id, { $inc: { quantity: -1 } });

    if (item.quantity == 1) {
      await item.deleteOne();
      // await sendEmail();
    }

    return res.status(200).json({ message: "item is deleted " });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Error", message: "Internal Server error" });
  }
};

const addItem = async (req, res, next) => {
  try {
    const item = new Item({ ...req.body });
    await item.save();
    return res.status(201).json(item);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "ERROR", message: "Internal Server Error" });
  }
};

const getAll = async (req, res) => {
  try {
    const allItems = await Item.find({});

    if (allItems.length === 0) {
      return res.status(204).json({ message: "No Items to find" });
    } else {
      return res.status(200).send(allItems);
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "ERROR", message: "Internal server error" });
  }
};

const getSum = async (req, res, next) => {
  try {
    const Id = req.params.id;
    const item = await Item.findById(Id);

    const result = await Item.aggregate([
      {
        $match: { _id: item._id },
      },
      {
        $project: {
          modelName: 1,
          total: { $multiply: ["$price", "$quantity"] },
        },
      },
    ]);
    console.log(result[0]);
    console.log(Item);

    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error", message: "Internal Server Error" });
  }
};

const getInvestment = async (req, res, next) => {
  try {
    const result = await Item.aggregate([
      {
        $match: {},
      },

      {
        $group: {
          _id: null,
          prices: {
            $sum: {
              $multiply: ["$price", "$quantity"],
            },
          },
        },
      },
      {
        $project: {
          amount: "$prices",
        },
      },
    ]);

    return res.status(200).json(result[0]);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Error", message: "Internal Server Error" });
  }
};
module.exports = {
  addItem,
  deleteSingle,
  getAll,
  getSum,
  getInvestment,
  transaction,
};
