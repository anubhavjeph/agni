module.exports.UpdateLeftRight = function(device_id,x,y,x1,y1){
		var deltaX = x1-x,
			deltaY = y1-y;
		var counter = 0;
		if(Math.abs(deltaY) > Math.abs(deltaX)){
			if(deltaY < 0 ){
				if(deltaX > 0){
					counter = 1;
				}else if(deltaX<0){
					counter = -1;
				}

			}else if(deltaY > 0){
				if(deltaX < 0){
					counter = 1;
				}else if(deltaX > 0){
					counter = -1;
				}
			}
		}else if(Math.abs(deltaY) < Math.abs(deltaX)){

			if(deltaX > 0){
				counter = 1;
			}else if(deltaX < 0){
				counter = -1;
			}
		}

		return [
			'MERGE (dev:device {id:"'+ device_id +'"})',
			'ON MATCH SET dev.orientation = dev.orientation+toInt("'+counter+'") '
		].join('\n');

}
