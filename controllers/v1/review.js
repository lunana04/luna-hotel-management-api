import GenericRepository from '../../repositories/generic.js';

const reviewRepository = new GenericRepository('review', 'reviewId');

const createReview = async (req, res) => {
  try {
    await reviewRepository.create(req.body);
    const newReviews = await reviewRepository.findAll(req);
    return res.status(201).json({
      message: 'Review successfully created',
      data: newReviews,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getReviews = async (req, res) => {
  try {
    const filters = {
      rating: req.query.rating || undefined,
    };   

    const sortBy = req.query.sortBy || "reviewId";
    const sortOrder = req.query.sortOrder === "desc" ? "desc" : "asc";
    const reviews = await reviewRepository.findAll(
      req,
      filters,
      sortBy,
      sortOrder
    );    
    if (!reviews) {
      return res.status(404).json({ message: 'No reviews found' });
    }
    return res.status(200).json({
      data: reviews,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getReview = async (req, res) => {
  try {
    const review = await reviewRepository.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        message: `No review with the id: ${req.params.id} found`,
      });
    }
    return res.status(200).json({
      data: review,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const updateReview = async (req, res) => {
  try {
    let review = await reviewRepository.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        message: `No review with the id: ${req.params.id} found`,
      });
    }
    review = await reviewRepository.update(req.params.id, req.body);
    return res.status(200).json({
      message: `Review with the id: ${req.params.id} successfully updated`,
      data: review,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await reviewRepository.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        message: `No review with the id: ${req.params.id} found`,
      });
    }
    await reviewRepository.delete(req.params.id);
    return res.json({
      message: `Review with the id: ${req.params.id} successfully deleted`,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
};