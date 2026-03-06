import GenericRepository from '../../repositories/generic.js';

const inventoryRepository = new GenericRepository('inventory', 'inventoryId');

const createInventory = async (req, res) => {
  try {
    await inventoryRepository.create(req.body);
    const newInventories = await inventoryRepository.findAll(req);
    return res.status(201).json({
      message: 'Inventory successfully created',
      data: newInventories,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getInventories = async (req, res) => {
  try {
    const filters = {
      itemName: req.query.itemName || undefined,
    };   

    const sortBy = req.query.sortBy || "inventoryId";
    const sortOrder = req.query.sortOrder === "desc" ? "desc" : "asc";
    const inventories = await inventoryRepository.findAll(
      req,
      filters,
      sortBy,
      sortOrder
    );    
    if (!inventories) {
      return res.status(404).json({ message: 'No inventories found' });
    }
    return res.status(200).json({
      data: inventories,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getInventory = async (req, res) => {
  try {
    const inventory = await inventoryRepository.findById(req.params.id);
    if (!inventory) {
      return res.status(404).json({
        message: `No inventory with the id: ${req.params.id} found`,
      });
    }
    return res.status(200).json({
      data: inventory,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const updateInventory = async (req, res) => {
  try {
    let inventory = await inventoryRepository.findById(req.params.id);
    if (!inventory) {
      return res.status(404).json({
        message: `No inventory with the id: ${req.params.id} found`,
      });
    }
    inventory = await inventoryRepository.update(req.params.id, req.body);
    return res.status(200).json({
      message: `Inventory with the id: ${req.params.id} successfully updated`,
      data: inventory,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const deleteInventory = async (req, res) => {
  try {
    const inventory = await inventoryRepository.findById(req.params.id);
    if (!inventory) {
      return res.status(404).json({
        message: `No inventory with the id: ${req.params.id} found`,
      });
    }
    await inventoryRepository.delete(req.params.id);
    return res.json({
      message: `Inventory with the id: ${req.params.id} successfully deleted`,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export {
  createInventory,
  getInventories,
  getInventory,
  updateInventory,
  deleteInventory,
};