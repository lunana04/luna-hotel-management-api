import GenericRepository from '../../repositories/generic.js';

const reservationRepository = new GenericRepository('reservation', 'reservationId');

const createReservation = async (req, res) => {
  try {
    await reservationRepository.create(req.body);
    const newReservations = await reservationRepository.findAll(req);
    return res.status(201).json({
      message: 'Reservation successfully created',
      data: newReservations,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getReservations = async (req, res) => {
  try {
    const filters = {
      guestId: req.query.guestId || undefined,
    };   

    const sortBy = req.query.sortBy || "reservationId";
    const sortOrder = req.query.sortOrder === "desc" ? "desc" : "asc";
    const reservations = await reservationRepository.findAll(
      req,
      filters,
      sortBy,
      sortOrder
    );    
    if (!reservations) {
      return res.status(404).json({ message: 'No reservations found' });
    }
    return res.status(200).json({
      data: reservations,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getReservation = async (req, res) => {
  try {
    const reservation = await reservationRepository.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({
        message: `No reservation with the id: ${req.params.id} found`,
      });
    }
    return res.status(200).json({
      data: reservation,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const updateReservation = async (req, res) => {
  try {
    let reservation = await reservationRepository.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({
        message: `No reservation with the id: ${req.params.id} found`,
      });
    }
    reservation = await reservationRepository.update(req.params.id, req.body);
    return res.status(200).json({
      message: `Reservation with the id: ${req.params.id} successfully updated`,
      data: reservation,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const deleteReservation = async (req, res) => {
  try {
    const reservation = await reservationRepository.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({
        message: `No reservation with the id: ${req.params.id} found`,
      });
    }
    await reservationRepository.delete(req.params.id);
    return res.json({
      message: `Reservation with the id: ${req.params.id} successfully deleted`,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export {
  createReservation,
  getReservations,
  getReservation,
  updateReservation,
  deleteReservation,
};