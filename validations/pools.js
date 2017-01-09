'use strict';

const joi = require('joi');

module.exports = {
  post: {
    body: {
      type: joi.string()
        .trim()
        .label('Type')
        .required(),

      amount: joi.number()
        .min(0)
        .max(2147483647)
        .label('Amount')
        .required(),

      radius: joi.number()
        .integer()
        .min(1)
        .label('Radius')
        .required(),

      expiration: joi.date()
        .label('Expiration')
        .required(),

      health: joi.number()
        .min(0)
        .label('Health')
        .required(),

      latitude: joi.number()
        .precision(15)
        .label('Latitude')
        .required(),

      longitude: joi.number()
        .precision(15)
        .label('Longitude')
        .required(),
    },
  }
};
