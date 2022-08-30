import * as path from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-require-imports
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
  // debug: process.env.NODE_ENV !== 'production',
});
import * as bcryptjs from 'bcryptjs';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3001,

  secretId: process.env.secretId,
  secretKey: process.env.secretKey,
  internal: process.env.internal === 'true',
  capiPassword: process.env.demoPassword
    ? bcryptjs.hashSync(process.env.demoPassword, 10)
    : '',
});
