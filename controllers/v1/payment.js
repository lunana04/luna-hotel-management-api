import GenericRepository from '../../repositories/generic.js';

const paymentRepository = new GenericRepository('payment', 'paymentId');

const createPayment = async (req, res) => {
  try {
    await paymentRepository.create(req.body);
    const newPayments = await paymentRepository.findAll(req);
    return res.status(201).json({
      message: 'Payment successfully created',
      data: newPayments,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getPayments = async (req, res) => {
  try {
    const filters = {
      paymentMethod: req.query.roomType || undefined,
    };

    const sortBy = req.query.sortBy || "paymentId";
    const sortOrder = req.query.sortOrder === "desc" ? "desc" : "asc";
    const payments = await paymentRepository.findAll(
      req,
      filters,
      sortBy,
      sortOrder
    );    
    if (!payments) {
      return res.status(404).json({ message: 'No payments found' });
    }
    return res.status(200).json({
      data: payments,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getPayment = async (req, res) => {
  try {
    const payment = await paymentRepository.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({
        message: `No payment with the id: ${req.params.id} found`,
      });
    }
    return res.status(200).json({
      data: payment,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const updatePayment = async (req, res) => {
  try {
    let payment = await paymentRepository.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({
        message: `No payment with the id: ${req.params.id} found`,
      });
    }
    payment = await paymentRepository.update(req.params.id, req.body);
    return res.status(200).json({
      message: `Payment with the id: ${req.params.id} successfully updated`,
      data: payment,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const deletePayment = async (req, res) => {
  try {
    const payment = await paymentRepository.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({
        message: `No payment with the id: ${req.params.id} found`,
      });
    }
    await paymentRepository.delete(req.params.id);
    return res.json({
      message: `Payment with the id: ${req.params.id} successfully deleted`,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export {
  createPayment,
  getPayments,
  getPayment,
  updatePayment,
  deletePayment,
};