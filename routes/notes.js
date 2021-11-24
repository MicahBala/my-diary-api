const router = require("express").Router();
const Notes = require("../models/Notes");

// CREATE A NOTE
router.post("/", async (req, res) => {
  const newNote = await new Notes(req.body);
  try {
    const savedNote = await newNote.save();
    res.status(200).json(savedNote);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET ALL NOTES
router.get("/", async (req, res) => {
  const owner = req.query.owner;
  if (owner) {
    try {
      const notes = await Notes.find({ owner });
      console.log(notes);
      if (notes.length === 0) {
        res.status(401).json({
          status: "Error",
          message: "Cant find notes for this user",
        });
        return;
      }

      res.status(200).json({
        status: "Success",
        notes,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(401).json({
      status: "Error",
      message: "Cant find notes for this user",
    });
  }
});

// GET A SINGLE NOTE
router.get("/:id", async (req, res) => {
  try {
    const note = await Notes.findById(req.params.id);
    res.status(200).json({
      status: "Success",
      note,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// UPDATE A NOTE
router.put("/:id", async (req, res) => {
  const note = await Notes.findById(req.params.id);

  try {
    if (note.owner === req.body.owner) {
      try {
        const updatedNote = await Notes.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true }
        );

        res.status(200).json(updatedNote);
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(401).json("You cant update this post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// DELETE A NOTE
router.delete("/:id", async (req, res) => {
  try {
    const note = await Notes.findById(req.params.id);

    if (note.owner === req.body.owner) {
      try {
        await note.deleteOne({ _id: note._id });
        res.status(200).json({
          status: "Success",
          message: "Note has been deleted...!",
        });
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(401).json("You cant delete this note");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
