'use strict';

const assert = require('assert');
const MA = require('../BarcodeParser');

describe('Test', function () {
    describe('#MA test', function () {
        it('"12345"不是有效的MA码', function () {
            const maCode = '12345'
            const MAObj = MA.getMACodeObj(maCode);
            assert.equal(MAObj, null);
        });
        it('"MA.156.M0.100761.21234561.Sx00008.M220117.L20220117.D20220118.E220130.V220117.C3"MA码的产品编码为123456', function () {
            const maCode = 'MA.156.M0.100761.21234561.Sx00008.M220117.L20220117.D20220118.E220130.V220117.C3'
            const MAObj = MA.getMACodeObj(maCode);
            assert.equal(MAObj.goodsCode, '123456');
        });

        it('"MA.156.M0.100761.21234561.Sx00008.M220117.L20220117.D20220118.E220130.V220117.C3"MA码的DI为MA.156.M0.100761.21234561', function () {
            const maCode = 'MA.156.M0.100761.21234561.Sx00008.M220117.L20220117.D20220118.E220130.V220117.C3'
            const MAObj = MA.getMACodeObj(maCode);
            assert.equal(MAObj.di, 'MA.156.M0.100761.21234561');
        });

        it('"MA.156.M0.100761.21234561"MA码的PI部分为空', function () {
            const maCode = 'MA.156.M0.100761.21234561'
            const MAObj = MA.getMACodeObj(maCode);
            assert.equal(MAObj.pi, '');
        });

        it('"MA.156.M0.100761.21234561"MA码的PI对象各部分是空值', function () {
            const maCode = 'MA.156.M0.100761.21234561'
            const MAObj = MA.getMACodeObj(maCode);
            const MAPIObj = MAObj.piObj;
            for (const piKey in MAPIObj) {
                assert.equal(MAPIObj[piKey], '');
            }
        });

        it('"MA.156.M0.100761.21234561.Sx00008.M220117.L20220117.D20220118.E220130.V220117.C3"MA码的PI为Sx00008.M220117.L20220117.D20220118.E220130.V220117.C3', function () {
            const maCode = 'MA.156.M0.100761.21234561.Sx00008.M220117.L20220117.D20220118.E220130.V220117.C3'
            const MAObj = MA.getMACodeObj(maCode);
            assert.equal(MAObj.pi, 'Sx00008.M220117.L20220117.D20220118.E220130.V220117.C3');
        });

        it('"MA.156.M0.100761.21234561.Sx00008.M220117.L20220117.D20220118.E220130.V220117.C3"MA码的PI为Sx00008.M220117.L20220117.D20220118.E220130.V220117.C3', function () {
            const maCode = 'MA.156.M0.100761.21234561.Sx00008.M220117.L20220117.D20220118.E220130.V220117.C3'
            const MAObj = MA.getMACodeObj(maCode);
            const MAPIObj = MAObj.piObj;
            assert.equal(MAPIObj.serial, 'x00008');         //序列号
            assert.equal(MAPIObj.prodDate, '2022-01-17');       //生产日期
            assert.equal(MAPIObj.lot, '20220117');          //批号
            assert.equal(MAPIObj.sterilizeLot, '20220118'); //灭菌批号
            assert.equal(MAPIObj.exp, '2022-01-30');            //失效日期
            assert.equal(MAPIObj.safeDate, '2022-01-17');       //有效期
        });
    });
});