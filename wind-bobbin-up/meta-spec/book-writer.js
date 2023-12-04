/*
 * Default implementation for creating a manual test book
 * when using the "provengo gen-book" command.
 */

let count=0;
let actionCount = 0;

function startTrace() {
    count=0;
    actionCount=0;
}

function documentEvent( event ) {
    // generate tags based on Combi and Choice events.
    GenBook.autoTag(event); 
    
    /////////////////////////////////////////////////
    // Manual Lib code addition
    // Let ManualLib handle its own events - html formal. 
    //  For QC and Excel, use "qc-xls" instead of "html".
    
    if ( Manual.addTestBookStep(event, "html") ) {
        // if we're here, `event` is a ManualLib event.
        
        // count actions (i.e. lines of song) separately
        if ( event.data.type === "action" ) {
            actionCount++;
        }
        return;
    } 
    
    // End of Manual Lib code addition
    /////////////////////////////////////////////////
    
    const d = event.data;
    if ( d ) {
        if ( d.lib === "Ctrl" ) {
            if ( d.verb === "marker" ) {
                TEST_SCENARIO.addElement(
                    StepElement(`<strong>${d.value}</strong>`,
                        `<div style="background-color:yellow; color:black">Mark: ${d.value}</div>`, "" ));
            } else {
                TEST_SCENARIO.addElement(
                    StepElement(`<strong>${d.verb}</strong>`, d.value, "" ));
            }
        } else if (d.lib == "StateMachines") {
            if ( ! event.contains(mainFlow.doneEvent) ) {
                TEST_SCENARIO.addElement(
                    StepElement("New Verse", `<span style="color:#080">${event.name}</span>`, "" )
                );
            }
        } else if (d.lib == "bp-base") {
            return; // These events have no action related to them.

        } else {
            if ( typeof d === "object" ) {
               let text = "";
                let lis = [];
                for ( let k of Object.keys(d) ) {
                    let value;
                    try {
                        value = String(d[k]);
                    } catch (e) {
                        value = "(object " + e + ")";
                    }
                    lis.push(`<li><em>${k}:</em> &nbsp; ${value}</li>`);
                }
                text = "<ul>" + (lis.join("")) + "</ul>";
                TEST_SCENARIO.addElement( StepElement(event.name, "Data Fields:", text ));
            } else {
                TEST_SCENARIO.addElement( StepElement(event.name, event.data.toString(), "" ));
            }
        }
        
    } else {
        TEST_SCENARIO.addElement( StepElement("Step", event.name, event.toString() ));
    }
    count++;
}

function endTrace() {
    TEST_SCENARIO.addMetadataLine("Event count: " + count);
    TEST_SCENARIO.addTag("Song line count", actionCount);
}

// This object is the callback entry point.
const TEST_BOOK = {
    startTrace: startTrace,
    documentEvent: documentEvent,
    endTrace: endTrace
};
