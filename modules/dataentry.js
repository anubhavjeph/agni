var nodeConnect = require("./nodeconnect.js");
var nodeUpdate = require("./updates.js")
// Device and App Start State
module.exports.createDeviceStateStart = function(dataObj){
// if(dataObj["appid"] !== undefined || dataObj["appid"] !== undefined || dataObj["device"] !== undefined || dataObj["interaction"] !== undefined || dataObj["appid"] !== undefined )
    var app_id = dataObj["app_id"],
        device = dataObj.device,
        node = dataObj.node,
        id = dataObj.id,
        id1 = app_id + node;
        console.log(device +"=====");
    var query = nodeConnect.nodeCreation("device",id,'n',device,"device") + '\n' +
                nodeConnect.nodeCreation("node",id1,'m',device,"node") +'\n' +
                nodeConnect.DeviceToNode('n','m');
    return query;
}


// State to state and Apps State
module.exports.createStatesApp = function(dataObj){
    console.log("createStatesApp");
    var app_id = dataObj["app_id"],
        x = dataObj.x,
        y = dataObj.y,
        x1 = dataObj.x1,
        y1 = dataObj.y1,
        device_id = dataObj.device_id,
        device = dataObj.device,
        node = dataObj.node,
        prev_node = dataObj.prevnode,
        interaction = dataObj.interaction,
        last_node = dataObj.last_node;
        console.log("createStatesApp");
        console.log(device);
        var id = app_id + node,
            id1 = app_id + prev_node;
        var query = 
                    nodeUpdate.UpdateLeftRight(device_id,x,y,x1,y1) +'\n' +
                    nodeConnect.nodeCreation("node",id,'n',device,"node") +'\n' +
                    nodeConnect.nodeCreation("node",id1,'m',device,"node") +'\n' +
                    nodeConnect.nodeTonode(app_id,node,prev_node,interaction,'n','m',x,y,x1,y1,device_id) +
                    '\n' +
                    nodeConnect.nodeToDevCordinate(app_id,device,x,y,x1,y1) + 'RETURN n';
    // console.log(query);
    return query;
}


// Device and App Start State
module.exports.createDeviceApp = function(dataObj){
     console.log("createDeviceApp");
    var app_id = dataObj["app_id"],
        device = dataObj.device,
        node = dataObj.node,
        inventory = dataObj.inven,
        interaction = "tap",
        x = dataObj.x,
        y = dataObj.y,
        x1 = dataObj.x1,
        y1 = dataObj.y1;


    // console.log(dataObj.node);
    // console.log(dataObj.inven);
    // console.log(dataObj);
    var id = app_id+node,
        id1 = inventory,
        interaction = "tap";
    var query = 
            nodeConnect.nodeCreation("node",id,'n',device,"node") +
            nodeConnect.nodeCreation("inventory",inventory,'m',device,"app",app_id,"ip5",x,y,x1,y1) +
            nodeConnect.nodeToapp(id,inventory,interaction,x,y,x1,y1,'n','m') +
            'RETURN n';
    return query;
}