import * as Joi from 'joi';
import { envConfigVariables } from '../env.config';
export const envValidator = Joi.object({
  [envConfigVariables.port]: Joi.string(),
});
