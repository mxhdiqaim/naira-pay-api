import Openfort from '@openfort/openfort-node';
import { getEnvVariable } from '../utils';

const openForSecretKey = getEnvVariable('OPENFORT_SECRET_KEY');

// Initialize the Openfort client and export it for use throughout the application
const openfort = new Openfort(openForSecretKey);

export default openfort;