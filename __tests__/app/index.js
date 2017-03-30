import appRootDir   from 'app-root-dir';
import path         from 'path';
import Pleeb        from '../../src/index';

const contractPath = path.join(appRootDir.get(), './__tests__/app/api_contract.json');
const contractFixturePath = path.join(appRootDir.get(), './__tests__/app/api_contract.json');

try {
  Pleeb.build({
    src: `./__tests__/app/__mocks__/**/*.mock.js`,
    dest: `./__tests__/app`,
  });
} catch (error) {
  console.log(error);
}
