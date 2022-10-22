const express = require("express");
const router = express.Router();
const Book = require("../models/bookModel");
const Stats = require("../models/statsModel");
const { check, validationResult } = require("express-validator");
const multer = require("multer");
const xl = require("excel4node");

//upload image
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, "BooksImage" + Date.now() + file.originalname);
  },
});

const fileFilter = function (req, file, cb) {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/svg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: diskStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 8 * 1024 * 1024 * 2,
  },
});

// create a book
router.post("/", upload.single("image"), async (req, res) => {
  const { title, description, quantity, price } = req.body;
  const image = req.file.path;
  try {
    const isExists = await Book.findOne({ title });
    if (isExists) {
      return res.status(400).json({
        data: {
          msg: "The book exists",
        },
      });
    }
    const newBook = await Book.create({
      title,
      description,
      quantity,
      price,
      image,
    });
    res.status(201).json({
      data: newBook,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        error,
        msg: "Internal error",
      },
    });
  }
});

router.get("/stats", async (req, res) => {
  const allSoldBooks = await Stats.find({});

  const wb = new xl.Workbook();

  const ws = wb.addWorksheet("report");

  ws.cell(1, 1).string("№");
  ws.cell(1, 2).string("Title");
  ws.cell(1, 3).string("Date");
  ws.cell(1, 4).string("Cash");
  ws.cell(1, 5).string("Plastic Card");
  ws.cell(1, 6).string("Returned");

  allSoldBooks.forEach((el, index) => {
    ws.cell(index + 2, 1).string(`${index + 1}`);
    ws.cell(index + 2, 2).string(`${el.title}`);
    ws.cell(index + 2, 3).date(el.date);
    ws.cell(index + 2, 4).string(`${el.cash}`);
    ws.cell(index + 2, 5).string(`${!el.cash}`);
    ws.cell(index + 2, 6).string(`${el.returned}`);
  });

  wb.write("./uploads/excel.xlsx");

  res.status(200).json({
    data: allSoldBooks,
  });
});

//get all books
router.get("/", async (req, res) => {
  try {
    const allBooks = await Book.find({});

    res.status(200).json({
      data: allBooks,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        error,
        msg: "Internal error",
      },
    });
  }
});

//get a book by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        data: {
          msg: "The book not found",
        },
      });
    }

    res.status(200).json({
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        error,
        msg: "Internal error",
      },
    });
  }
});

//change a book
router.put("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const image = req?.file?.path;
  let toUpdate = { ...req.body };
  toUpdate.image = image && image;

  try {
    const updateBook = await Book.findByIdAndUpdate(id, toUpdate, {
      new: true,
    });

    console.log(updateBook);

    res.status(200).json({
      data: updateBook,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        error,
        msg: "Internal error",
      },
    });
  }
});

//delete
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const book = Book.findById(id);

  if (!book) {
    return res.status(404).json({
      data: {
        msg: "The book not found",
      },
    });
  }

  await book.remove();

  res.status(200).json({
    data: {
      msg: "The book deleted",
    },
  });
});

router.post("/stats", async (req, res) => {
  const { title, date, cash, returned } = req.body;
  try {
    const soldBook = await Stats.create({
      title,
      date,
      cash,
      returned,
    });
    res.status(201).json({
      data: soldBook,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        error,
        msg: "Internal error",
      },
    });
  }
});

module.exports = router;
