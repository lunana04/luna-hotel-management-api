import GenericRepository from '../../repositories/generic.js';

const userRepository = new GenericRepository('user', 'id');

const createUser = async (req, res) => {
  try {
    if (req.user.role === 'NORMAL') {
      return res.status(403).json({
        message: 'You are not authorized to create a user',
      });
    }
    else if (req.user.role === 'ADMIN') {
      if (req.body.role !== 'NORMAL') {
        return res.status(403).json({
          message: 'ADMINs can only create NORMAL users',
        });
      }
      delete req.body.password;
    }
    else if (req.user.role === 'SUPER_ADMIN') {
      if (req.body.role !== 'SUPER_ADMIN') {
        delete req.body.password;
      }
    }
    await userRepository.create(req.body);
    const newUsers = await userRepository.findAll(req);
    return res.status(201).json({
      message: 'User successfully created',
      data: newUsers,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const filters = {
      id: req.query.id || undefined,
      firstName: req.query.firstName || undefined,
    };

    const sortBy = req.query.sortBy || 'id';
    const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc';

    const result = await userRepository.findAll(req, filters, sortBy, sortOrder);
    const users = result.data;

    const filteredUsers = users.filter((user) => {
      console.log('Checking user:', user.firstName, user.role);
      if (req.user.role === 'SUPER_ADMIN') {
        return true;
      }
      if (req.user.role === 'ADMIN') {
        return user.role !== 'SUPER_ADMIN';
      }
      if (req.user.role === 'NORMAL') {
        return user.id === req.user.id;
      }
      return false;
    });

    return res.status(200).json({
      data: filteredUsers,
      pagination: {
        total: result.amount,
        nextPage: result.nextPage,
        previousPage: result.previousPage,
      },
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await userRepository.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: `No user with the id: ${req.params.id} found`,
      });
    }

    if (req.user.role === 'NORMAL' && user.id !== req.user.id) {
      return res.status(403).json({
        message: 'You are not authorized to view this user',
      });
    }

    if (req.user.role === 'ADMIN' && user.role === 'SUPER_ADMIN') {
      return res.status(403).json({
        message: 'You are not authorized to view this user',
      });
    }

    return res.status(200).json({
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    let user = await userRepository.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: `No user with the id: ${req.params.id} found`,
      });
    }
    else if (req.body.role) {
      return res.status(403).json({
        message: 'Changing user role is not allowed',
      });
    }
    else if (req.body.password) {
      return res.status(403).json({
        message: 'Password updates not allowed here',
      });
    }
    else if (req.user.role === 'SUPER_ADMIN') {
      if (user.id !== req.user.id) {
        return res.status(403).json({
          message: 'You are not authorized to update this user',
        });
      }
    }
    else if (req.user.role === 'ADMIN') {
      if (user.role !== 'NORMAL' && user.id !== req.user.id) {
        return res.status(403).json({
          message: 'You are not authorized to update this user',
        });
      }
    }
    else if (req.user.role === 'NORMAL') {
      if (user.id !== req.user.id) {
        return res.status(403).json({
          message: 'You are not authorized to update this user',
        });
      }
    }
    if (req.body.emailAddress) {
      const existingUser = await userRepository.findByField('emailAddress', req.body.emailAddress);
      if (existingUser && existingUser.id !== req.params.id) {
        return res.status(409).json({
          message: 'Email address already in use',
        });
      }
    }

    user = await userRepository.update(req.params.id, req.body);
    return res.status(200).json({
      message: `User with the id: ${req.params.id} successfully updated`,
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await userRepository.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: `No user with the id: ${req.params.id} found`,
      });
    }
    await userRepository.delete(req.params.id);
    return res.json({
      message: `User with the id: ${req.params.id} successfully deleted`,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export { createUser, getUsers, getUser, updateUser, deleteUser };