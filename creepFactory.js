 var creepFactory = {
     buyCreeps: function() {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');

        var harvesterBodies = [[WORK,CARRY,MOVE], [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE]]

        // Purchase harvestors as highest priority
        if(harvesters.length < 3) {
            var newName = 'Harvester' + Game.time;

            if (Game.spawns['Spawn1'].room.energyAvailable >= 450) {
                Game.spawns['Spawn1'].spawnCreep(harvesterBodies[1], newName,
                    {memory: {role: 'harvester'}});
            }
            else {
                Game.spawns['Spawn1'].spawnCreep(harvesterBodies[0], newName,
                    {memory: {role: 'harvester'}});
                }
        }

        else if(Game.spawns['Spawn1'].room.energyAvailable > 400) {
            if(upgraders.length < 1) {
                var newName = 'Upgrader' + Game.time;
                Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName,
                    {memory: {role: 'upgrader'}});
            }

            else if(builders.length < 2) {
                var newName = 'Builder' + Game.time;
                Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName,
                    {memory: {role: 'builder'}});
            }
        }

        if(Game.spawns['Spawn1'].spawning) {
            var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
            Game.spawns['Spawn1'].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns['Spawn1'].pos.x + 1,
                Game.spawns['Spawn1'].pos.y,
                {align: 'left', opacity: 0.8});
        }
     }
 };

module.exports = creepFactory;