import appRootDir   from 'app-root-dir';
import {unlinkSync, readFileSync} from 'fs';
import path         from 'path';
import Pleeb        from '../src/index';

const contractPath = path.join(appRootDir.get(), './__tests__/app/api_contract.json');
const contractFixturePath = path.join(appRootDir.get(), './__tests__/app/api_contract.fixture.json');

describe('Builder', () => {
  beforeEach(async (done) => {
    await Pleeb.build({
      src: `./__tests__/app/__mocks__/**/*.mock.js`,
      dest: `./__tests__/app`,
    });
    done();
  });

  afterEach(() => {
    unlinkSync(contractPath);
  });

  it('generates the same number of routes', () => {
    var apiContractFixture = JSON.parse(readFileSync(contractFixturePath, 'utf8'));
    var fileContents = require(contractPath);

    expect(fileContents.length).toEqual(apiContractFixture.length);
  });

  it('generates a valid contract', () => {
    var apiContractFixture = JSON.parse(readFileSync(contractFixturePath, 'utf8'));
    var fileContents = require(contractPath);

    expect(fileContents).toEqual(apiContractFixture);
  });
});
