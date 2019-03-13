const api = [
    require('./game').default,
    require('./payment').default,
    require('./platform').default,
    require('./player').default,
    require('./playerLevel').default,
    require('./reward').default,
];
const obj = {
    getTemplateSetting(data){
        return all.tool.findSession({
            service: 'platform',
            functionName: 'getTemplateSetting',
            data: data
        })
    }
};
const findSession = [
    'getTemplateSetting',
    'getPlatformDetails',
    'getBankTypeList',
    // 'getFrontEndData',
];
const findLocal = [
    'getProvinceList',
]
api.forEach(el => {
    el.functionName.forEach(functionName => {
        if(findSession.includes(functionName)){
            obj[functionName] = data => all.tool.findSession({
                service: el.service,
                functionName,
                data,
            })
        } else if(findLocal.includes(el.functionName)){
            obj[functionName] = data => all.tool.findLocal({
                service: el.service,
                functionName,
                data,
            })
        } else {
            obj[functionName] = data => all.net.send({
                service: el.service,
                functionName,
                data,
            })
        }
    });
});
export default obj