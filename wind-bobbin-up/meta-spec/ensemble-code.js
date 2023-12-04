// @provengo summon ctrl

/**
 * List of events "of interest" that we want test suites to cover.
 * 
 * Note that here we use methods for getting the events (session.xEvent) rather
 * than the methods for requesting them (session.doX).
 */
const GOALS = [
    tester.actionEvent("Wind it back again"),
    tester.validationEvent("Child has hands on knees"),
    tester.noteEvent("Repeat as necessary"),
];


/**
 * Ranks test suites by how many events from the GOALS array were met.
 * The more goals are met, the higher the score.
 * 
 * It make no difference if a goal was met more then once.
 *
 * @param {Event[][]} ensemble The test suite to be ranked.
 * @returns Number of events from GOALS that have been met.
 */
function rankByMetGoals( ensemble ) {
    const unreachedGoals = [];
    for ( let idx=0; idx<GOALS.length; idx++ ) {
        unreachedGoals.push(GOALS[idx]);
    }

    for (let testIdx = 0; testIdx < ensemble.length; testIdx++) {
        let test = ensemble[testIdx];
        for (let eventIdx = 0; eventIdx < test.length; eventIdx++) {
            let event = test[eventIdx];
            for (let ugIdx=unreachedGoals.length-1; ugIdx >=0; ugIdx--) {
                let unreachedGoal = unreachedGoals[ugIdx];
                if ( unreachedGoal.contains(event) ) {
                    unreachedGoals.splice(ugIdx,1);
                }
            }
        }
    }

    return GOALS.length-unreachedGoals.length;
}

/**
 * Rank ensemble by the percentage of goals it meets.
 * 
 * @param {Event[][]} ensemble the test suite/ensemble to be ranked
 * @returns the rank of the ensemble.
 */
 function rankingFunction(ensemble) {
    
    // How many goals did `ensemble` hit?
    const metGoalsCount = rankByMetGoals(ensemble);
    // What percentage of the goals did `ensemble` cover?
    const metGoalsPercent = metGoalsCount/GOALS.length;

    return metGoalsPercent*100; // convert to human-readable percentage
}

