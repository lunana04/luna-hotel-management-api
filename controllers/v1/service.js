import GenericRepository from '../../repositories/generic.js';

const serviceRepository = new GenericRepository('service', 'serviceId');

const createService = async (req, res) => {
  try {
    await serviceRepository.create(req.body);
    const newServices = await serviceRepository.findAll(req);
    return res.status(201).json({
      message: 'Service successfully created',
      data: newServices,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getServices = async (req, res) => {
  try {
    const filters = {
      serviceName: req.query.serviceName || undefined,
    };

    const sortBy = req.query.sortBy || 'serviceId';
    const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc';
    const services = await serviceRepository.findAll(
      req,
      filters,
      sortBy,
      sortOrder
    );
    if (!services) {
      return res.status(404).json({ message: 'No services found' });
    }
    return res.status(200).json({
      data: services,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getService = async (req, res) => {
  try {
    const service = await serviceRepository.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        message: `No service with the id: ${req.params.id} found`,
      });
    }
    return res.status(200).json({
      data: service,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const updateService = async (req, res) => {
  try {
    let service = await serviceRepository.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        message: `No service with the id: ${req.params.id} found`,
      });
    }
    service = await serviceRepository.update(req.params.id, req.body);
    return res.status(200).json({
      message: `Service with the id: ${req.params.id} successfully updated`,
      data: service,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await serviceRepository.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        message: `No service with the id: ${req.params.id} found`,
      });
    }
    await serviceRepository.delete(req.params.id);
    return res.json({
      message: `Service with the id: ${req.params.id} successfully deleted`,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export { createService, getServices, getService, updateService, deleteService };
