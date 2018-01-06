import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { createEchoServer, createGetServer, createPostServer } from './server';

chai.use(chaiAsPromised);

const { expect } = chai;

global.expect = expect;
