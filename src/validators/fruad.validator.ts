import * as Joi from 'joi';

export const detectFruadValidator = Joi.object({
  name: Joi.string().required(),
});
