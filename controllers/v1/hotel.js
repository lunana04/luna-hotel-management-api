import GenericRepository from '../../repositories/generic.js';

const hotelRepository = new GenericRepository('hotel', 'hotelId');

const createHotel = async (req, res) => {
  try {
    await hotelRepository.create(req.body);
    const newHotels = await hotelRepository.findAll(req);
    return res.status(201).json({
      message: 'Hotel successfully created',
      data: newHotels,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getHotels = async (req, res) => {
  try {
    const filters = {
      name: req.query.name || undefined,
    };

    const sortBy = req.query.sortBy || 'hotelId';
    const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc';
    const hotels = await hotelRepository.findAll(
      req,
      filters,
      sortBy,
      sortOrder
    );
    if (!hotels) {
      return res.status(404).json({ message: 'No hotels found' });
    }
    return res.status(200).json({
      data: hotels,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getHotel = async (req, res) => {
  try {
    const hotel = await hotelRepository.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({
        message: `No hotel with the id: ${req.params.id} found`,
      });
    }
    return res.status(200).json({
      data: hotel,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const updateHotel = async (req, res) => {
  try {
    let hotel = await hotelRepository.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({
        message: `No hotel with the id: ${req.params.id} found`,
      });
    }
    hotel = await hotelRepository.update(req.params.id, req.body);
    return res.status(200).json({
      message: `Hotel with the id: ${req.params.id} successfully updated`,
      data: hotel,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const deleteHotel = async (req, res) => {
  try {
    const hotel = await hotelRepository.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({
        message: `No hotel with the id: ${req.params.id} found`,
      });
    }
    await hotelRepository.delete(req.params.id);
    return res.json({
      message: `Hotel with the id: ${req.params.id} successfully deleted`,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export {
  createHotel,
  getHotels,
  getHotel,
  updateHotel,
  deleteHotel,
};