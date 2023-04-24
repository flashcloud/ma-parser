'use strict';

const moment = require('moment');

const maSplitor = '.'
const PI_STRUCT = {
    lot: 'L',           //批号
    prodDate: 'M',      //生产日期
    safeDate: 'V',      //有效期
    exp: 'E',           //失效日期
    serial: 'S',        //序列号
    sterilizeLot: 'D',  //灭菌批号
    ybcode: 'Y'         //医保编码
}

function decode(barcode) {
    return getMACodeObj(barcode);
}

function getMAPIObj(maPICode) {
    //构造一个PI对象
    let piObj = {}
    for (const piDefAtt in PI_STRUCT) {
        piObj[piDefAtt] = '';
    }

    if (maPICode === null || maPICode === undefined || maPICode === '') return piObj;
    const piAry = maPICode.split(maSplitor);

    for (const piPart of piAry) {
        if (piPart.length > 1) {
            const piKey = piPart.substring(0, 1);
            for (const piDefAtt in PI_STRUCT) {
                if (PI_STRUCT[piDefAtt] == piKey) {
                    piObj[piDefAtt] = piPart.substring(1, piPart.length);
                    break;
                }
            }
        }
    }

    //必须将所有的日期进行格式化后输出
    piObj.prodDate = formtDate(piObj.prodDate);
    piObj.safeDate = formtDate(piObj.safeDate);
    piObj.exp = formtDate(piObj.exp);

    return piObj;
}

function getMACodeObj(maCode){
    //解码如：MA.156.M0.100204.13351764
    const udiDIAry = maCode.split(maSplitor);

    const DI_PART_LEN = 5;

    //MA码 ${maCode} 似乎不符合编码规则
    if (udiDIAry.length < DI_PART_LEN) return null;

    //获取di
    let diArray = [];
    for (let i = 0; i<DI_PART_LEN; i++) {
        diArray.push(udiDIAry[i]);
    }
    const di = diArray.join(maSplitor);

    //获取pi部分的字符
    let piArray = [];
    if (udiDIAry.length > DI_PART_LEN) {
        for (let i = DI_PART_LEN; i < udiDIAry.length; i++) {
            piArray.push(udiDIAry[i]);
        }
    }
    const pi = piArray.join(maSplitor);

    //解析PI的各部分内容
    //下面不直接使用piObj = getMAPIObj(pi)是为了开发时可以利用开发工具的.出代码提示
    let piObj = PI_STRUCT;
    if (true) piObj = getMAPIObj(pi);

    return  {
        di: di,
        pi: pi,
        piObj: piObj,
        issuer: udiDIAry[0], //MA发行机构：MA(2位)
        contry: udiDIAry[1], //国家代码：156(3位)
        trade:  udiDIAry[2], //行业代码：M0(2位)
        registrant: udiDIAry[3], //注册人(6位)
        goodsCode: udiDIAry[4].substring(1, 7),  //产品编码
        issuerOfContry: `${udiDIAry[0]}${maSplitor}${udiDIAry[1]}`, //国家所在的发行机构
        ISSUER_OF_CHINA: `MA${maSplitor}156`    //中国发行机构
    }
}

function formtDate(str) {
    if (str === '' || str === null || str === undefined) return '';
    const d = moment(str, 'YYMMDD');

    return d.format("YYYY-MM-DD");
}

module.exports = {
    decode: decode,
    getMACodeObj: getMACodeObj,
    getMAPIObj: getMAPIObj
};