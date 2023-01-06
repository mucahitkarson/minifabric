/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const {Contract} = require('fabric-contract-api');
const crypto = require('crypto');

async function getCollectionName(ctx) {
    const mspid = ctx.clientIdentity.getMSPID();
    const type = ctx.clientIdentity.getAttributeValue("Type");
    console.log(mspid, "11");
    console.log(type, "22");

    return `_implicit_org_${mspid}`;
}

class SensorDataJsPrjContract extends Contract {

    async sensorDataJsPrjExists(ctx, sensorDataJsPrjId) {
        const buffer = await ctx.stub.getState(sensorDataJsPrjId);
        return (!!buffer && buffer.length > 0);
    }

    async createSensorDataJsPrj(ctx, sensorDataJsPrjId, value) {

        let txID = ctx.stub.getTxID();

        await ctx.stub.putState(txID, Buffer.from(JSON.stringify({"id": sensorDataJsPrjId, "value": value})));
        await ctx.stub.putState(sensorDataJsPrjId, Buffer.from(value.toString() + "#" + txID.toString() + "#" + sensorDataJsPrjId));
        return ctx.stub.getTxID().toString();
    }

    async createSensorDataJsPrjPrvt(ctx, sensorDataJsPrjId, value) {
        let txID = ctx.stub.getTxID();
        const collectionName = await getCollectionName(ctx);
        await ctx.stub.putPrivateData(collectionName, sensorDataJsPrjId, Buffer.from(value.toString() + "#" + txID.toString() + "#" + sensorDataJsPrjId));
        return ctx.stub.getTxID().toString();
    }


    async readSensorDataJsPrjPrvt(ctx, sensorDataJsPrjId) {
        const exists = await this.sensorDataJsPrjExists(ctx, sensorDataJsPrjId);
        if (!exists) {
            throw new Error(`The sensor data js prj ${sensorDataJsPrjId} does not exist`);
        }
        const collectionName = await getCollectionName(ctx);
        const buffer = await ctx.stub.getPrivateData(collectionName, sensorDataJsPrjId);
        return JSON.parse(buffer.toString());
    }

    async readSensorDataJsPrj(ctx, sensorDataJsPrjId) {
        const exists = await this.sensorDataJsPrjExists(ctx, sensorDataJsPrjId);
        if (!exists) {
            throw new Error(`The sensor data js prj ${sensorDataJsPrjId} does not exist`);
        }
        console.log("1");
        const buffer = await ctx.stub.getState(sensorDataJsPrjId);
        console.log("2");
        const asset = JSON.parse(buffer.toString());
        console.log("3");
        return asset;
    }

    async updateSensorDataJsPrj(ctx, sensorDataJsPrjId, newValue) {
        const exists = await this.sensorDataJsPrjExists(ctx, sensorDataJsPrjId);
        if (!exists) {
            throw new Error(`The sensor data js prj ${sensorDataJsPrjId} does not exist`);
        }
        const asset = {value: newValue};
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(sensorDataJsPrjId, buffer);
    }

    async deleteSensorDataJsPrj(ctx, sensorDataJsPrjId) {
        const exists = await this.sensorDataJsPrjExists(ctx, sensorDataJsPrjId);
        if (!exists) {
            throw new Error(`The sensor data js prj ${sensorDataJsPrjId} does not exist`);
        }
        await ctx.stub.deleteState(sensorDataJsPrjId);
    }


    async getHistory(ctx, id) {
        let resultsIterator = await ctx.stub.getHistoryForKey(id);
        let results = await this.GetAllResults(resultsIterator, true);

        return JSON.stringify(results);
    }

    async GetAllResults(iterator, isHistory) {
        let allResults = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                console.log(res.value.value.toString('utf8'));
                if (isHistory && isHistory === true) {
                    jsonRes.TxId = res.value.tx_id;
                    jsonRes.Timestamp = res.value.timestamp;
                    try {
                        jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Value = res.value.value.toString('utf8');
                    }
                } else {
                    jsonRes.Key = res.value.key;
                    try {
                        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Record = res.value.value.toString('utf8');
                    }
                }
                allResults.push(jsonRes);
            }
            res = await iterator.next();
        }
        iterator.close();
        return allResults;
    }

}

module.exports = SensorDataJsPrjContract;
