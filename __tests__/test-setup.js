global.console = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

jest.mock('decache');
