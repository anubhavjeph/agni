
function createNodeData(app_id){
	return ["{",
				"id:'"+app_id+"',",
				"state : 0,",
				"installs: 0",
				"}"].join('\n');
}



function createDeviceData(id,device,orientation){
	return ["{",
			"id:'"+id+"',",
			"orientation : 1,",
			"device: '"+device+"'",
			"}"].join('\n');
}

module.exports.nodeCreation = function(state,id,name,devices,type,app_id,device,x,y,x1,y1){
	console.log(devices + "-----");
	var set_param = "";
	if(type === "node"){
		set_param = createNodeData(id);
	}else if(type === "device"){
		console.log("Node Creation !!!");
		console.log(devices);
		set_param = createDeviceData(id,devices,"right");
	}else if(type === "app"){ 
		set_param = createstateDevice(id,devices,x,y,x1,y1);
	}
	return [
		'MERGE ('+name+':'+state+' {id:"'+id+'"})',
		'ON CREATE SET '+name+'='+set_param,
		'ON MATCH SET '+name+'.count = '+name+'.count +1'
	].join('\n');
}

function createNodeToNode(app_id,prev_node,device_id,interaction,x,y,x1,y1){
    

	return ["{",
			"id:'"+device_id+interaction+"',",
			"from: '"+app_id+prev_node+"',",
			"user: '"+device_id +"',",
			"x: '"+x+"',",
			"y: '"+y+"',",
			"x1: '"+x1+"',",
			"y1: '"+y1+"',",
			"count:1 ",
			"}"].join('\n');

}


module.exports.nodeTonode = function(app_id,node,prev_node,interaction,name,name_2,x,y,x1,y1,device_id){

	return [
			'MERGE ('+name+')-[wow:'+interaction+'  { id: "'+device_id+interaction+'" }]-('+name_2+')',
			'ON CREATE SET wow='+createNodeToNode(app_id,prev_node,device_id,interaction,x,y,x1,y1),
			'ON MATCH SET wow.count =wow.count +1'
		   ].join('\n');

}


function createInteraction(app_id,device,x,y,x1,y1,cord){
	return [
		"{",
	  	"id:'"+cord+"',",
	  	"x:"+x+",",
	  	"y:"+y+",",
	  	"x1:"+x1+",",
	  	"y1:"+y1+",",
	  	"device:'"+device+"',",
		"count: 1",
		"}"
	].join('\n');
}


module.exports.nodeToDevCordinate = function(app_id,device,x,y,x1,y1){
	var cord = x+y+x1+y1;
	return [
			'MERGE (x:'+device+' {id:"'+cord+'"})',
			'ON CREATE SET x='+createInteraction(app_id,device,x,y,x1,y1,cord),
			'ON MATCH SET x.count =x.count +1',
			'MERGE (m)-[y:point_interaction]-(x)'
		   ].join('\n');

}

module.exports.DeviceToNode = function(name,name1){

	return [
			'MERGE ('+name+')-[y:seen]->('+name1+')'
		   ].join('\n');

}

function createstateDevice(app_id,device,x,y,x1,y1,cord){
	return [
		"{",
	  	"id:'"+app_id+"',",
	  	"x:"+x+",",
	  	"y:"+y+",",
	  	"x1:"+x1+",",
	  	"y1:"+y1+",",
	  	"device:'"+device+"',",
		"count: 1",
		"}"
	].join('\n');
}


module.exports.nodeToapp = function(id,inventory,interaction,x,y,x1,y1,name,name1){

	// console.log("***************************");
	// console.log(id);
	// console.log(inventory);
	// console.log(interaction);
	// console.log(x);
	// console.log(y);
	// console.log(x1);
	// console.log(y1);

	return [
			'MERGE ('+name+')-[y:tap]-('+name1+')'
		   ].join('\n');
}