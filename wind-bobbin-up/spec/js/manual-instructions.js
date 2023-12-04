/**
 * This file contains the song instructions, by verse (technically, by the state machine's individual states)
 */

// Define a manual test session. This will register the manual test steps that will be done by a
//  single, manual QA tester.
const tester = Manual.defineUser("Test Session 1");

mainFlow.at("wind it up").run(function(){
    // perform an action, specify some details.
    tester.doAct("Wind the bobbin up", "Use your fingers to wind the bobbin up");
    // perform an action, specify some details and validation
    tester.doAct("Wind the bobbin up", "Use fingers again", "Make sure the bobbin is wound up");
    tester.doAct("Pull, Pull", "", "The bobbin should be tight now");
    
    // Add a note to the manual tester - not a test step, but some information that they should be aware of. 
    tester.doNote(
        "Perform the next step quietly if there are sleeping babies around.",
        "Make sure to look in nearby rooms as well."
    );
    
    tester.doAct("Clap, clap, clap", "Clap your hands");
});

mainFlow.at("wind it back again").run(function(){
    // Minimal example (no details or validations)
    tester.doAct("Wind it back again");
    tester.doAct("Wind it back again");
    tester.doAct("Pull, Pull");
    tester.doAct("Clap, clap, clap");
});

mainFlow.at("point at things").run(function(){
    // A validation activity describes a validation that is not bound to a specific action.
    //  (if it was, consider adding it as a third parameter to doAct() )
    tester.doValidate("Ensure your are in a room with a window", "Alternatively, prepare pictures of a ceiling, a floor, a window, and a door.");
    if ( maybe("Use classic pointing order") ) {
        tester.doAct("Point to the ceiling");
        tester.doAct("Point to the floor");
        tester.doAct("Point to the window");
        tester.doAct("Point to the door");
    } else {
        tester.doAct("Point to the window");
        tester.doAct("Point to the door");
        tester.doAct("Point to the ceiling");
        tester.doAct("Point to the floor");
    }
});

mainFlow.at("clap 'n count").run(function(){
    tester.doAct("Clap your hands together");
    tester.doAct("One two three");
    tester.doAct("Put your hands upon your knee", "Slow down as you say this line");
    tester.doValidate("Child has hands on knees");
    tester.doNote("Repeat as necessary");
});