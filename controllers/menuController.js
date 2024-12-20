const Menu = require('../models/Menu');

const getMenu = async (req, res) => {
  try {
    const menuItems = await Menu.find(); // Fetch all menu items
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch menu items' });
  }
};

module.exports = { getMenu };
