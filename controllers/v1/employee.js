import GenericRepository from '../../repositories/generic.js';

const employeeRepository = new GenericRepository('employee', 'employeeId');

const createEmployee = async (req, res) => {
  try {
    await employeeRepository.create(req.body);
    const newEmployees = await employeeRepository.findAll(req);
    return res.status(201).json({
      message: 'Employee successfully created',
      data: newEmployees,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getEmployees = async (req, res) => {
  try {
    const filters = {
      ...(req.query.position && {
        position: { equals: req.query.position.toUpperCase() },
      }),
    };

    const sortBy = req.query.sortBy || 'employeeId';
    const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc';

    const employees = await employeeRepository.findAll(
      req,
      filters,
      sortBy,
      sortOrder
    );

    if (!employees) {
      return res.status(404).json({ message: 'No employees found' });
    }

    return res.status(200).json({
      data: employees,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};


const getEmployee = async (req, res) => {
  try {
    const employee = await employeeRepository.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        message: `No employee with the id: ${req.params.id} found`,
      });
    }
    return res.status(200).json({
      data: employee,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    let employee = await employeeRepository.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        message: `No employee with the id: ${req.params.id} found`,
      });
    }
    employee = await employeeRepository.update(req.params.id, req.body);
    return res.status(200).json({
      message: `Employee with the id: ${req.params.id} successfully updated`,
      data: employee,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await employeeRepository.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        message: `No employee with the id: ${req.params.id} found`,
      });
    }
    await employeeRepository.delete(req.params.id);
    return res.json({
      message: `Employee with the id: ${req.params.id} successfully deleted`,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
};
