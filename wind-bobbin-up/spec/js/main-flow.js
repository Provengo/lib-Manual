// @provengo summon StateMachines

/**
 * Business-level decisions: what parts of "Wind the Bobbin Up" to sing and at what order.
 * 
 */

// Create a state machine for the main rhyme flow
const mainFlow = StateMachine("Main Flow");

// Normal song flow
mainFlow.connect("wind it up")
    .to("wind it back again")
    .to("point at things")
    .to("clap 'n count");

// Add a bypass for getting to the pointing part fast
mainFlow.connect("wind it up").to("point at things");

// Add a bypass for a very quicker version
mainFlow.connect("wind it up").to("clap 'n count");