var helper = require('./quaternianHelper')

exports.puppeteer = function(skin){
	console.log("Puppeteering")
	var logged = false

	var engager = zig.EngageUsersWithSkeleton(1);

	engager.addEventListener('userengaged', function(user) {
		console.log('User engaged: ' + user.id);
	 	
		user.addEventListener('userupdate', function(user) {
			if(!logged){
				console.log(user)
				console.log(zig.Joint)
				logged = true
			}
			if(user.skeletonTracked){
				console.log("Right arm")
				rightArm(skin, user.skeleton)
				console.log("left arm")
				leftArm(skin, user.skeleton)
				console.log("Right leg")
				rightLeg(skin, user.skeleton)
				console.log("leftleg")
				leftLeg(skin, user.skeleton)
				console.log("head:")
				head(skin, user.skeleton)
				console.log("torso:")
				torso(skin, user.skeleton)
				//body(skin, user.skeleton)
			}
		});
	});
	engager.addEventListener('userdisengaged', function(user) {
		console.log('User disengaged: ' + user.id);
	});
	zig.addListener(engager);
}

function rightArm(skin, skeleton){
	skin.rightArm.eulerOrder = "xyz"
	skin.rightArm.useQuaternion = true

	var base = helper.vector3FromPoints(skeleton[zig.Joint.RightShoulder].position, skeleton[zig.Joint.RightHip].position)
	var limb = helper.vector3FromPoints(skeleton[zig.Joint.RightHand].position, skeleton[zig.Joint.RightShoulder].position)
	
	var angle = helper.angleBetweenVectors(limb,base)
	var cross = helper.normalize3(base.cross(limb))
	skin.rightArm.quaternion.setFromAxisAngle(cross, Math.PI-angle)
}

function leftArm(skin, skeleton){
	skin.leftArm.eulerOrder = "xyz"
	skin.leftArm.useQuaternion = true

	var base = helper.vector3FromPoints(skeleton[zig.Joint.LeftShoulder].position, skeleton[zig.Joint.LeftHip].position)
	var limb = helper.vector3FromPoints(skeleton[zig.Joint.LeftHand].position, skeleton[zig.Joint.LeftShoulder].position)
	
	var angle = helper.angleBetweenVectors(limb,base)
	var cross = helper.normalize3(base.cross(limb))
	skin.leftArm.quaternion.setFromAxisAngle(cross, Math.PI-angle)
}

function head(skin, skeleton){
	skin.head.eulerOrder = "YZX"
	skin.head.useQuaternion = true

	var waist = helper.averagePoints(skeleton[zig.Joint.LeftHip].position, skeleton[zig.Joint.RightHip].position)

	var base = helper.vector3FromPoints(skeleton[zig.Joint.Neck].position, waist)
	var limb = helper.vector3FromPoints(skeleton[zig.Joint.Head].position, skeleton[zig.Joint.Neck].position)
	
	var angle = helper.angleBetweenVectors(limb,base)
	var cross = helper.normalize3(base.cross(limb))
	skin.head.quaternion.setFromAxisAngle(cross, -(angle))
}
function torso(skin, skeleton){
	skin.upperBody.eulerOrder = "ZYX"
	skin.upperBody.useQuaternion = true

	var leftHip = skeleton[zig.Joint.LeftHip].position
	var rightHip = skeleton[zig.Joint.RightHip].position
	var waist = helper.averagePoints(leftHip, rightHip)
	//console.log("Averaged hips: "+JSON.stringify(waist, null, '\t'))
	var base = helper.vector3FromPoints(waist, [0,-10000, 0])
	var limb = helper.vector3FromPoints(waist, skeleton[zig.Joint.Neck].position)
	
	var angle = helper.angleBetweenVectors(limb,base)
	var cross = helper.normalize3(base.cross(limb))
	//console.log("Torso axis: "+JSON.stringify(cross,null,'\t')+" and angle: "+angle)
	skin.upperBody.quaternion.setFromAxisAngle(cross, Math.PI-angle)

	skin.playerModel.useQuaternion = true
	skin.playerModel.eulerOrder = "ZYX"
	skin.playerModel.quaternion.setFromAxisAngle(cross, (Math.PI-angle))

	//Rotate whole body in correct direction.
	//This is glitchy so I'm leaving it out for now.
	// var hipFacing = [leftHip[0]-rightHip[0], leftHip[1]-rightHip[1]]
	// var theta = Math.atan2(hipFacing[0], hipFacing[1]);
	// skin.playerGroup.rotation.y = theta+1
}
function rightLeg(skin, skeleton){
	skin.rightLeg.eulerOrder = "xyz"
	skin.rightLeg.useQuaternion = true

	var base = helper.vector3FromPoints(skeleton[zig.Joint.RightShoulder].position, skeleton[zig.Joint.RightHip].position)
	var limb = helper.vector3FromPoints(skeleton[zig.Joint.RightFoot].position, skeleton[zig.Joint.RightHip].position)
	
	var angle = helper.angleBetweenVectors(limb,base)
	var cross = helper.normalize3(base.cross(limb))
	skin.rightLeg.quaternion.setFromAxisAngle(cross, Math.PI-angle)
}
function leftLeg(skin, skeleton){
	skin.leftLeg.eulerOrder = "xyz"
	skin.leftLeg.useQuaternion = true

	var base = helper.vector3FromPoints(skeleton[zig.Joint.LeftShoulder].position, skeleton[zig.Joint.LeftHip].position)
	var limb = helper.vector3FromPoints(skeleton[zig.Joint.LeftFoot].position, skeleton[zig.Joint.LeftHip].position)
	
	var angle = helper.angleBetweenVectors(limb,base)
	var cross = helper.normalize3(base.cross(limb))
	skin.leftLeg.quaternion.setFromAxisAngle(cross, Math.PI-angle)
}
function body(skin, skeleton){
	var hip1 = skeleton[zig.Joint.LeftHip].position
	var hip2 = skeleton[zig.Joint.RightHip].position
	var waist = helper.averagePoints(skeleton[zig.Joint.LeftHip].position, skeleton[zig.Joint.RightHip].position)
	
	//var newPosition = [waist.x+500, waist.y-46, waist.z-800]

	//console.log("Moving player to "+JSON.stringify(waist))
	//skin.playerGroup.position = newPosition
	
	skin.leftLeg.eulerOrder = "xyz"
	skin.leftLeg.useQuaternion = true

	var base = helper.vector3FromPoints(skeleton[zig.Joint.LeftShoulder].position, skeleton[zig.Joint.LeftHip].position)
	var limb = helper.vector3FromPoints(skeleton[zig.Joint.LeftFoot].position, skeleton[zig.Joint.LeftHip].position)
	
	var angle = helper.angleBetweenVectors(limb,base)
	var cross = helper.normalize3(base.cross(limb))
	skin.leftLeg.quaternion.setFromAxisAngle(cross, Math.PI-angle)
}
