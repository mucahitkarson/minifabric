/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { SensorDataJsPrjContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logger = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('SensorDataJsPrjContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new SensorDataJsPrjContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"sensor data js prj 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"sensor data js prj 1002 value"}'));
    });

    describe('#sensorDataJsPrjExists', () => {

        it('should return true for a sensor data js prj', async () => {
            await contract.sensorDataJsPrjExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a sensor data js prj that does not exist', async () => {
            await contract.sensorDataJsPrjExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createSensorDataJsPrj', () => {

        it('should create a sensor data js prj', async () => {
            await contract.createSensorDataJsPrj(ctx, '1003', 'sensor data js prj 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"sensor data js prj 1003 value"}'));
        });

        it('should throw an error for a sensor data js prj that already exists', async () => {
            await contract.createSensorDataJsPrj(ctx, '1001', 'myvalue').should.be.rejectedWith(/The sensor data js prj 1001 already exists/);
        });

    });

    describe('#readSensorDataJsPrj', () => {

        it('should return a sensor data js prj', async () => {
            await contract.readSensorDataJsPrj(ctx, '1001').should.eventually.deep.equal({ value: 'sensor data js prj 1001 value' });
        });

        it('should throw an error for a sensor data js prj that does not exist', async () => {
            await contract.readSensorDataJsPrj(ctx, '1003').should.be.rejectedWith(/The sensor data js prj 1003 does not exist/);
        });

    });

    describe('#updateSensorDataJsPrj', () => {

        it('should update a sensor data js prj', async () => {
            await contract.updateSensorDataJsPrj(ctx, '1001', 'sensor data js prj 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"sensor data js prj 1001 new value"}'));
        });

        it('should throw an error for a sensor data js prj that does not exist', async () => {
            await contract.updateSensorDataJsPrj(ctx, '1003', 'sensor data js prj 1003 new value').should.be.rejectedWith(/The sensor data js prj 1003 does not exist/);
        });

    });

    describe('#deleteSensorDataJsPrj', () => {

        it('should delete a sensor data js prj', async () => {
            await contract.deleteSensorDataJsPrj(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a sensor data js prj that does not exist', async () => {
            await contract.deleteSensorDataJsPrj(ctx, '1003').should.be.rejectedWith(/The sensor data js prj 1003 does not exist/);
        });

    });

});
