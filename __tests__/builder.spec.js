import appRootDir   from 'app-root-dir';
import {unlinkSync} from 'fs';
import path         from 'path';
import Pleeb        from '../src/index';

const contractPath = path.join(appRootDir.get(), './__tests__/app/__mocks__/api_contract.json');
const contractFixturePath = path.join(appRootDir.get(), './__tests__/app/__mocks__/api_contract.json');

describe('Builder', () => {
  beforeEach(async (done) => {
    await Pleeb.build({
      src: `./__tests__/app/__mocks__/**/*.mock.js`,
      dest: `./__tests__/app/__mocks__/`,
    });
    done();
  });

  afterEach(() => {
    unlinkSync(contractPath);
    console.log('Deleted file')
  });

  it('generates a valid contract', () => {
    var apiContractFixture = require(contractFixturePath);
    var fileContents = require(contractPath);

    expect(fileContents).toEqual(apiContractFixture);
  });
});
