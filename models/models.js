const Joi = require("joi");

const userschema = Joi.object().keys({
  name: Joi.string()
    .min(3)
    .max(30)
    .required(),
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required(),
  role: Joi.string().required(),
  profile_id: Joi.string().required(),
  password: Joi.string().required()
});

const teacherschema = Joi.object().keys({
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required(),
  subjects: Joi.array(),
  name: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  role: Joi.string().required(),
  profile_id: Joi.string().required()
});

const studentschema = Joi.object().keys({
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required(),
  roll_no: Joi.number(),
  name: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  role: Joi.string().required(),
  resources: Joi.array(),
  grade: Joi.string(),
  profile_id: Joi.string().required()
});

module.exports = {
  userschema,
  teacherschema,
  studentschema
};
