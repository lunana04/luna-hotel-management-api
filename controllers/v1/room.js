import GenericRepository from '../../repositories/generic.js';

const roomRepository = new GenericRepository('room', 'roomId');

const createRoom = async (req, res) => {
  try {
    await roomRepository.create(req.body);
    const newRooms = await roomRepository.findAll(req);
    return res.status(201).json({
      message: 'Room successfully created',
      data: newRooms,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getRooms = async (req, res) => {
  try {
    const filters = {
      roomType: req.query.roomType || undefined,
    };

    const sortBy = req.query.sortBy || "roomId";
    const sortOrder = req.query.sortOrder === "desc" ? "desc" : "asc";
    const rooms = await roomRepository.findAll(
      req,
      filters,
      sortBy,
      sortOrder
    );
    if (!rooms) {
      return res.status(404).json({ message: 'No rooms found' });
    }
    return res.status(200).json({
      data: rooms,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getRoom = async (req, res) => {
  try {
    const room = await roomRepository.findById(req.params.id);
    if (!room) {
      return res.status(404).json({
        message: `No room with the id: ${req.params.id} found`,
      });
    }
    return res.status(200).json({
      data: room,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const updateRoom = async (req, res) => {
  try {
    let room = await roomRepository.findById(req.params.id);
    if (!room) {
      return res.status(404).json({
        message: `No room with the id: ${req.params.id} found`,
      });
    }
    room = await roomRepository.update(req.params.id, req.body);
    return res.status(200).json({
      message: `Room with the id: ${req.params.id} successfully updated`,
      data: room,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const room = await roomRepository.findById(req.params.id);
    if (!room) {
      return res.status(404).json({
        message: `No room with the id: ${req.params.id} found`,
      });
    }
    await roomRepository.delete(req.params.id);
    return res.json({
      message: `Room with the id: ${req.params.id} successfully deleted`,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export {
  createRoom,
  getRooms,
  getRoom,
  updateRoom,
  deleteRoom,
};
