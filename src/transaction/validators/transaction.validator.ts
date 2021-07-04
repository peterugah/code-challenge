import * as Joi from 'joi';

export const transactionsValidator = Joi.object({
  transactionId: Joi.string()
    .required()
    .error(new Error('please provide the transaction id')),
  confidenceLevel: Joi.number()
    .min(0)
    .max(1)
    .required()
    .error(new Error('please provide a confidence level between 0 and 1')),
});
