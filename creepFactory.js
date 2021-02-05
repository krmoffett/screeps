class CreepFactory {
    buyCreeps(roomTier) {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');

        const harvesterBodies = [[WORK,CARRY,MOVE], [WORK,WORK,WORK,WORK,MOVE]];
        const upgraderBodies = [[WORK,CARRY,MOVE], [WORK,WORK,CARRY,MOVE,MOVE]];
        const carrierBodies = [[null], [CARRY,CARRY,MOVE]];
        let baseHarvestorCost = this.calculateCost(harvesterBodies[0]);

        var harvestersNeeded = Game.spawns['Spawn1'].room.find(FIND_SOURCES).length;

        const populationTiers = [{"harvesters": 3, "carriers": 0, "upgraders": 2, "builders": 2},
                                 {"harvesters": harvestersNeeded, "carriers": 2,"upgraders": 2, "builders": 2}];

        // Current population tier is the lower of the room tier and number of defined population tiers
        var populationLimits = populationTiers[Math.min(roomTier, (populationTiers.length - 1))];

        // Calculate harvester tier to be used for spawning harvesters and carriers
        var harvesterTier = roomTier;
        while ((this.calculateCost(harvesterBodies[harvesterTier]) > (Game.spawns['Spawn1'].room.energyAvailable)) &&
                (harvesterTier > 0)) {
                harvesterTier--;
        }

        // Purchase harvestors as highest priority
        if(harvesters.length < populationLimits["harvesters"]) {
            var newName = 'Harvester' + Game.time;

            Game.spawns['Spawn1'].spawnCreep(harvesterBodies[harvesterTier], newName,
                {memory: {role: 'harvester'}});
        }

        // Purchase carriers
        else if (Game.spawns['Spawn1'].room.energyAvailable > baseHarvestorCost && harvesterTier > 0) {
            if (carriers.length < populationLimits["carriers"]) {
                var newName = 'Carrier' + Game.time;
                var carrierTier = roomTier;
                while ((this.calculateCost(carrierBodies[carrierTier]) > (Game.spawns['Spawn1'].room.energyAvailable + baseHarvestorCost)) && (carrierTier > 1)) {
                        carrierTier--;
                }
                Game.spawns['Spawn1'].spawnCreep(carrierBodies[carrierTier], newName,
                    {memory: {role: 'carrier'}});
            }
        }

        // Purchase upgraders
        else if (Game.spawns['Spawn1'].room.energyAvailable > 400) {
            if (upgraders.length < populationLimits["upgraders"]) {
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

            // Purchase builders
            else if ((builders.length < populationLimits["builders"] && Game.spawns['Spawn1'].room.find(FIND_MY_CONSTRUCTION_SITES).length > 0)
                    || builders.length < 2) {
                var newName = 'Builder' + Game.time;
                Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName,
                    {memory: {role: 'builder'}});
            }
        }
        if (Game.spawns['Spawn1'].spawning) {
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