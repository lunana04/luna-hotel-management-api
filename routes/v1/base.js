import express from 'express';
import jwtAuth from "../../middleware/jwtAuth.js";

const createRouter = (
  controller,
  postValidator,
  putValidator,
  authorisation
) => {
  const router = express.Router();

  router.get('/', jwtAuth, controller.get);
  router.get('/:id', jwtAuth, controller.getById);
  if (postValidator && authorisation && controller.create) {
    router.post('/', jwtAuth, postValidator, authorisation, controller.create);
  }
  router.put('/:id', jwtAuth, putValidator, controller.update);
  router.delete('/:id', jwtAuth, controller.delete);

  return router;
};

export default createRouter;
