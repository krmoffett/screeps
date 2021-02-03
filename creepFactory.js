class CreepFactory {
    buyCreeps(roomTier) {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');

        const harvesterBodies = [[WORK,CARRY,MOVE], [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE]];
        const upgraderBodies = [[WORK,CARRY,MOVE], [WORK,WORK,CARRY,MOVE,MOVE]];
        let baseHarvestorCost = this.calculateCost(harvesterBodies[0]);

        const populationTiers = [{"harvesters": 3, "upgraders": 2, "builders": 2}];

        // Current population tier is the lower of the room tier and number of defined population tiers
        var populationLimits = populationTiers[Math.min(roomTier, (populationTiers.length - 1))];

        // Purchase harvestors as highest priority
        if(harvesters.length < populationLimits["harvesters"]) {
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
            if(upgraders.length < populationLimits["upgraders"]) {
                var newName = 'Upgrader' + Game.time;
                var upgraderTier = roomTier;
                console.log(upgraders.length + "/" + populationLimits["upgraders"]);
                while ((this.calculateCost(upgraderBodies[upgraderTier]) > (Game.spawns['Spawn1'].room.energyAvailable + baseHarvestorCost)) &&
                       (upgraderTier > 0)) {
                    upgraderTier--;
                }
                Game.spawns['Spawn1'].spawnCreep(upgraderBodies[upgraderTier], newName,
                    {memory: {role: 'upgrader'}});
            }

            else if(builders.length < populationLimits["builders"] && Game.spawns['Spawn1'].room.find(FIND_MY_CONSTRUCTION_SITES).length > builders.length) {
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

    calculateCost(bodyParts) {
        if (bodyParts) {
        const BodyCostDict = {"move":50, "work":100, "carry": 50};
        var costSum = 0;
        for (var part of bodyParts) {
            costSum += BodyCostDict[part];
        }
        return costSum;
        }
    }
};
module.exports = CreepFactory;