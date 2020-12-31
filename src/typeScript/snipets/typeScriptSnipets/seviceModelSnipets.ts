import * as models from './index';
import { SignupBaasUserBody } from '../../bassUser/bassUserTypes';
import baasuser = require('../models/baasuser');

// Creating application
export const signupBaasUser = async (applicationBody: SignupBaasUserBody) => {
  return await baasuser(models.dbConfig).signup(applicationBody);
};
