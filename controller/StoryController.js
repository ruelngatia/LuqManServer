import Story from "../model/Story.js";
import User from "../model/User.js";

export const getStories = async (req, res) => {
    const id = req.params.id
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "USER NOT FOUND" });
    }

    const stories = await Story.find({ user_id: id });

    return res.status(200).json({ stories: stories });
  } catch (error) {
    console.error("Error in getStories:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const createStory = async (req, res) => {
    const id = req.params.id
    const story = req.body.story
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "USER NOT FOUND" });
    }

    await Story.create({ user_id: id, story: story})
    console.log('STORY SAVED');

    return res.status(200).json({ success: "STORY SAVED" });
  } catch (error) {
    console.error("Error in createStory:", error);
    return res.status(500).json({ error: error.message });
  }
};
