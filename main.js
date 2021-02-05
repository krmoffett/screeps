var roleHarvester = require('role.harvester');
var roleCarrier = require('role.carrier');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
const CreepFactory = require('./creepFactory');

module.exports.loop = function () {

    // Clear unused creep memory
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    var roomTierDefs = [300, 550];
    var roomTier = 0;
    var i = 1;
    while (Game.spawns['Spawn1'].room.energyAvailable >= roomTierDefs[i]) {
        roomTier++;
        i++;
    }
    creepFactory = new CreepFactory();
    creepFactory.buyCreeps(roomTier);
    //console.log("Capacity is: " + Game.spawns['Spawn1'].room.energyCapacityAvailable );

    var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }

    if (Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    }
}