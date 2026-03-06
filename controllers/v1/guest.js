import GenericRepository from '../../repositories/generic.js';

const guestRepository = new GenericRepository('guest', 'guestId');

const createGuest = async (req, res) => {
  try {
    await guestRepository.create(req.body);
    const newGuests = await guestRepository.findAll(req);
    return res.status(201).json({
      message: 'Guest successfully created',
      data: newGuests,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getGuests = async (req, res) => {
  try {
    const filters = {
      guestId: req.query.guestId || undefined,
    };

    const sortBy = req.query.sortBy || "guestId";
    const sortOrder = req.query.sortOrder === "desc" ? "desc" : "asc";
    const guests = await guestRepository.findAll(
      req,
      filters,
      sortBy,
      sortOrder
    );
    if (!guests) {
      return res.status(404).json({ message: 'No guests found' });
    }
    return res.status(200).json({
      data: guests,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getGuest = async (req, res) => {
  try {
    const guest = await guestRepository.findById(req.params.id);
    if (!guest) {
      return res.status(404).json({
        message: `No guest with the id: ${req.params.id} found`,
      });
    }
    return res.status(200).json({
      data: guest,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const updateGuest = async (req, res) => {
  try {
    let guest = await guestRepository.findById(req.params.id);
    if (!guest) {
      return res.status(404).json({
        message: `No guest with the id: ${req.params.id} found`,
      });
    }
    guest = await guestRepository.update(req.params.id, req.body);
    return res.status(200).json({
      message: `Guest with the id: ${req.params.id} successfully updated`,
      data: guest,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const deleteGuest = async (req, res) => {
  try {
    const guest = await guestRepository.findById(req.params.id);
    if (!guest) {
      return res.status(404).json({
        message: `No guest with the id: ${req.params.id} found`,
      });
    }
    await guestRepository.delete(req.params.id);
    return res.json({
      message: `Guest with the id: ${req.params.id} successfully deleted`,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export {
  createGuest,
  getGuests,
  getGuest,
  updateGuest,
  deleteGuest,
};