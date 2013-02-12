 var allGuns=
 {"guns": 
	[
		{
			"name":"pistol",
			"maxAmmo": "6",
			"unlocks": "1",
			"isAutomatic": "false",
		},
		{
			"name":"magnum",
			"maxAmmo": "12",
			"unlocks": "6",
			"isAutomatic": "false",
		},
		{
			"name":"shotgun",
			"maxAmmo": "10",
			"unlocks": "12",
			"isAutomatic": "false",
		},
		{
			"name":"sniper",
			"maxAmmo": "20",
			"unlocks": "18",
			"isAutomatic": "false",
		},
		{
			"name":"ak47",
			"maxAmmo": "29",
			"unlocks": "24",
			"isAutomatic": "true",
			"rateOfFire": "200",
		},
		{
			"name":"tavor",
			"maxAmmo": "40",
			"unlocks": "30",
			"isAutomatic": "true",
			"rateOfFire": "200",
		}
	]
}

 var allPowerUps=
 {"powerUps": 
	[
		{
			"type":"frag",
			"duration": ["0","0"],
			"unlocks": "7",
			"damage": "5",
		},
		{
			"type":"stun",
			"duration": ["2000","3000"],
			"unlocks": "15",
		},
		{
			"type":"adrenaline",
			"duration": ["4000","6000"],
			"unlocks": "20",
		},
	]
 }

var allEnemies=
 {"enemies": 
	[
		{
			"id":"0",   // First level enemy, VERY easy
			"graphicsId": "0",
			"waitToShoot": "750",
			"duration":"3000",
			"damage":"5",
			"shots":"3",
			"chanceToHit":"0.2",
			"hp":"1",
		},
		{
			"id":"1",  // First level enemy, VERY easy
			"graphicsId": "6",
			"waitToShoot": "750",
			"duration":"2800",
			"damage":"5",
			"shots":"2",
			"chanceToHit":"0.3",
			"hp":"1",
		},
		{
			"id":"2",	// First world enemy
			"graphicsId": "3",
			"waitToShoot": "500",
			"duration":"2500",
			"damage":"5",
			"shots":"3",
			"chanceToHit":"0.6",
			"hp":"1",
		},
		{
			"id":"3",	// First world enemy
			"graphicsId": "7",
			"waitToShoot": "1200",
			"duration":"10",
			"damage":"6",
			"shots":"1",
			"chanceToHit":"1.0",
			"hp":"1",
		},
		{
			"id":"4",	// First world enemy
			"graphicsId": "0",
			"waitToShoot": "500",
			"duration":"2500",
			"damage":"6",
			"shots":"6",
			"chanceToHit":"0.2",
			"hp":"1",
		},
		{
			"id":"5",	// First world enemy
			"graphicsId": "6",
			"waitToShoot": "750",
			"duration":"2800",
			"damage":"7",
			"shots":"3",
			"chanceToHit":"0.8",
			"hp":"1",
		},
		{
			"id":"6",	// First world enemy
			"graphicsId": "3",
			"waitToShoot": "300",
			"duration":"3000",
			"damage":"10",
			"shots":"4",
			"chanceToHit":"0.4",
			"hp":"1",
		},
		{
			"id":"7",	// First world enemy
			"graphicsId": "7",
			"waitToShoot": "100",
			"duration":"3000",
			"damage":"10",
			"shots":"7",
			"chanceToHit":"0.2",
			"hp":"1",
		},
		{
			"id":"8",	// First world enemy
			"graphicsId": "0",
			"waitToShoot": "500",
			"duration":"2000",
			"damage":"10",
			"shots":"2",
			"chanceToHit":"0.8",
			"hp":"1",
		},
		{
			"id":"9",	// First world enemy
			"graphicsId": "6",
			"waitToShoot": "1000",
			"duration":"10",
			"damage":"10",
			"shots":"1",
			"chanceToHit":"1.0",
			"hp":"1",
		},

		// First World Boss
		{
			"id":"10",
			"graphicsId": "10",
			"waitToShoot": "150",
			"duration":"1000",
			"damage":"10",
			"shots":"1",
			"chanceToHit":"0.6",
			"hp":"25",
		},
		
		//Second World Enemies
		{
			"id":"11", 
			"graphicsId": "1",
			"waitToShoot": "200",
			"duration":"3000",
			"damage":"10",
			"shots":"3",
			"chanceToHit":"0.3",
			"hp":"1",
		},
		{
			"id":"12",  
			"graphicsId": "6",
			"waitToShoot": "400",
			"duration":"2800",
			"damage":"5",
			"shots":"4",
			"chanceToHit":"0.8",
			"hp":"1",
		},
		{
			"id":"13",
			"graphicsId": "8",
			"waitToShoot": "300",
			"duration":"10",
			"damage":"15",
			"shots":"1",
			"chanceToHit":"0.7",
			"hp":"1",
		},
		{
			"id":"14",
			"graphicsId": "9",
			"waitToShoot": "200",
			"duration":"3000",
			"damage":"10",
			"shots":"6",
			"chanceToHit":"0.4",
			"hp":"1",
		},
		{
			"id":"15",	
			"graphicsId": "1",
			"waitToShoot": "250",
			"duration":"1500",
			"damage":"15",
			"shots":"4",
			"chanceToHit":"0.4",
			"hp":"1",
		},
		{
			"id":"16",
			"graphicsId": "6",
			"waitToShoot": "300",
			"duration":"3000",
			"damage":"15",
			"shots":"3",
			"chanceToHit":"0.8",
			"hp":"1",
		},
		{
			"id":"17",
			"graphicsId": "8",
			"waitToShoot": "100",
			"duration":"4000",
			"damage":"20",
			"shots":"8",
			"chanceToHit":"0.2",
			"hp":"1",
		},
		{
			"id":"18",
			"graphicsId": "9",
			"waitToShoot": "200",
			"duration":"1500",
			"damage":"20",
			"shots":"2",
			"chanceToHit":"0.6",
			"hp":"1",
		},
		{
			"id":"19",
			"graphicsId": "1",
			"waitToShoot": "500",
			"duration":"10",
			"damage":"15",
			"shots":"1",
			"chanceToHit":"1.0",
			"hp":"1",
		},
		
		//World 2 Boss
		{
			"id":"20",
			"graphicsId": "11",
			"waitToShoot": "250",
			"duration":"800",
			"damage":"10",
			"shots":"1",
			"chanceToHit":"1.0",
			"hp":"20",
		},
		
		//Third World Enemies
		{
			"id":"21", 
			"graphicsId": "0",
			"waitToShoot": "100",
			"duration":"3000",
			"damage":"10",
			"shots":"6",
			"chanceToHit":"0.2",
			"hp":"1",
		},
		{
			"id":"22",  
			"graphicsId": "2",
			"waitToShoot": "200",
			"duration":"2800",
			"damage":"20",
			"shots":"2",
			"chanceToHit":"0.6",
			"hp":"1",
		},
		{
			"id":"23",
			"graphicsId": "3",
			"waitToShoot": "500",
			"duration":"10",
			"damage":"25",
			"shots":"1",
			"chanceToHit":"1.0",
			"hp":"1",
		},
		{
			"id":"24",
			"graphicsId": "4",
			"waitToShoot": "150",
			"duration":"4000",
			"damage":"5",
			"shots":"10",
			"chanceToHit":"0.5",
			"hp":"1",
		},
		{
			"id":"25",	
			"graphicsId": "0",
			"waitToShoot": "100",
			"duration":"2000",
			"damage":"15",
			"shots":"3",
			"chanceToHit":"0.4",
			"hp":"1",
		},
		{
			"id":"26",
			"graphicsId": "2",
			"waitToShoot": "300",
			"duration":"1300",
			"damage":"20",
			"shots":"2",
			"chanceToHit":"0.8",
			"hp":"1",
		},
		{
			"id":"27",
			"graphicsId": "3",
			"waitToShoot": "150",
			"duration":"3000",
			"damage":"20",
			"shots":"4",
			"chanceToHit":"0.4",
			"hp":"1",
		},
		{
			"id":"28",
			"graphicsId": "4",
			"waitToShoot": "100",
			"duration":"3000",
			"damage":"10",
			"shots":"7",
			"chanceToHit":"0.2",
			"hp":"1",
		},
		{
			"id":"29",
			"graphicsId": "0",
			"waitToShoot": "500",
			"duration":"10",
			"damage":"25",
			"shots":"1",
			"chanceToHit":"1.0",
			"hp":"1",
		},
		
		//Third World Boss
		{
			"id":"30",
			"graphicsId": "12",
			"waitToShoot": "100",
			"duration":"100",
			"damage":"5",
			"shots":"2",
			"chanceToHit":"0.8",
			"hp":"15",
		},
		
		//Fourth World Enemies
		{
			"id":"31", 
			"graphicsId": "2",
			"waitToShoot": "100",
			"duration":"2700",
			"damage":"15",
			"shots":"7",
			"chanceToHit":"0.2",
			"hp":"1",
		},
		{
			"id":"32",  
			"graphicsId": "5",
			"waitToShoot": "200",
			"duration":"2000",
			"damage":"10",
			"shots":"2",
			"chanceToHit":"0.6",
			"hp":"1",
		},
		{
			"id":"33",
			"graphicsId": "8",
			"waitToShoot": "400",
			"duration":"10",
			"damage":"25",
			"shots":"1",
			"chanceToHit":"1.0",
			"hp":"1",
		},
		{
			"id":"34",
			"graphicsId": "9",
			"waitToShoot": "300",
			"duration":"3000",
			"damage":"20",
			"shots":"2",
			"chanceToHit":"0.5",
			"hp":"1",
		},
		{
			"id":"35",
			"graphicsId": "2",
			"waitToShoot": "100",
			"duration":"2500",
			"damage":"15",
			"shots":"6",
			"chanceToHit":"0.4",
			"hp":"1",
		},
		{
			"id":"36",
			"graphicsId": "5",
			"waitToShoot": "150",
			"duration":"3000",
			"damage":"20",
			"shots":"3",
			"chanceToHit":"0.6",
			"hp":"1",
		},
		{
			"id":"37",
			"graphicsId": "8",
			"waitToShoot": "100",
			"duration":"2000",
			"damage":"15",
			"shots":"3",
			"chanceToHit":"0.3",
			"hp":"1",
		},
		{
			"id":"38",
			"graphicsId": "9",
			"waitToShoot": "200",
			"duration":"2000",
			"damage":"15",
			"shots":"2",
			"chanceToHit":"0.8",
			"hp":"1",
		},
		{
			"id":"39",
			"graphicsId": "2",
			"waitToShoot": "400",
			"duration":"10",
			"damage":"35",
			"shots":"1",
			"chanceToHit":"1.0",
			"hp":"1",
		},
		
		//Fourth World Boss
		{
			"id":"40",
			"graphicsId": "13",
			"waitToShoot": "150",
			"duration":"1200",
			"damage":"10",
			"shots":"2",
			"chanceToHit":"0.8",
			"hp":"30",
		},
	]
}


function GameplayDB() {
}

GameplayDB.prototype.getAllPowerUps = function() {
	return allPowerUps.powerUps;
}
GameplayDB.prototype.getAllGuns = function() {
	return allGuns.guns;
}
GameplayDB.prototype.getAllEnemies= function() {
	return allEnemies.enemies;
}
