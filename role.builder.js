var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 withdraw');
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            var spawns = creep.room.find(FIND_MY_SPAWNS);
            if (Game.spawns['Spawn1'].room.energyAvailable > 250) {
                if(creep.withdraw(spawns[0], 'energy') == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawns[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
};

module.exports = roleBuilder;