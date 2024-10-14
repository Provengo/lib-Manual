/**
 * Experimental library for listing manual actions
 */
const Manual = (function(){
    const __LIB_SIG__ = "Manual";
    const TYPE_TO_TITLE = {
        "action":     "🔨 Act",
        "validation": "🔎 Validate",
        "note":       "🗒️ Note"
    };

    function evt(title, eventType, session) { 
        return Event(title, {lib:__LIB_SIG__, type:eventType, session:session});
    }

    const allEvents = EventSet("AllManualEvents", function(e){
        return (!!e.data) && e.data.lib == __LIB_SIG__;
    });

    const IGNORED_KEYS = ["lib", "type", "session"];
    /**
     * Utility function for representing JavaScript values in HTML.
     * @param {*} aValue The value to be represented.
     * @returns A HTML view of `aValue`.
     */
    function valueToHtml(aValue) {
        try {
            let objType = (typeof aValue);
            switch (objType ){
                case "undefined":
                    return "undefined";

                case "object":
                    if ( Array.isArray(aValue) ) {
                        let items = [];
                        for ( let idx in aValue ) {
                            items.push(`<li>${valueToHtml(aValue[idx])}</li>`);
                        }
                        return "<ol>" + items.join("") + "</ol>";
                        
                    } else {
                        let lis = [];
                        for ( let k of Object.keys(aValue) ) {
                            if ( IGNORED_KEYS && IGNORED_KEYS.indexOf(k) > -1 ) {
                                continue;
                            }
                            let aSubValue = aValue[k];
                            let htmlValue = valueToHtml(aSubValue, IGNORED_KEYS);
                            
                            lis.push(`<dt>${k}</dt><dd>${htmlValue}</dd>`);
                        }
                        return "<dl>" + (lis.join("")) + "</dl>";
                    }

                default:
                    return String(aValue);
            }
        } catch (e) {
            return JSON.stringify(aValue) + "<br><div style='font-size: 9pt; color:#ff8888; font-family:monospace'>(html generation error: " + e + ")</div>";
        }
    }

    function validationEvent(session, condition, details) {
        let e = evt("check: " + condition, "validation", session);
        e.data.condition = condition;
        if ( details ) {
            e.data.details = details;
        }
        return e;
    }
    
    function actionEvent(session, action, details, validation) {
        let e = evt("do: " + action, "action", session);
        e.data.action = action;
        if ( details ) { e.data.details = details; }
        if ( validation ) { e.data.validation = validation; }
        return e;
    }

    function noteEvent(session, text, details) {
        let e = evt("note: " + text, "note", session);
        e.data.text = text;
        if ( details ) {
            e.data.details = details;
        }
        return e;
    }

    
    function doValidate(session, msg, details){
        return request(validationEvent(session, msg, details));
    }
    
    function doAction(session, action, details, validation) {
        return request(actionEvent(session, action, details, validation));
    }
    
    function doNote(session, text, details){
        return request(noteEvent(session, text, details));
    }
    
    function makeSession(name) {
        return {
            noteEvent: function(text, details){ return noteEvent(name, text, details); },
            doNote:    function(text, details){ return doNote(name, text, details); },
            actionEvent: function(action, details, validation){ return actionEvent(name, action, details, validation); },
            doAct:       function(action, details, validation){ return doAction(name, action, details, validation); },
            validationEvent: function(condition, details){ return validationEvent(name, condition, details); },
            doValidate:      function(condition, details){ return doValidate(name, condition, details); },
            any: EventSet(`any ${name} event`, function(e){
                return (allEvents.contains(e) && e.data.session === name);
            })
        };
    }

    function createHtmlBookStep( e ) {
        let evtType = e.data.type;
        let title = `${TYPE_TO_TITLE[evtType]}<div style='font-size:smaller'>${e.data.session}</div>`;
        let body = "";
        let details = e.data.details || "";
        
        switch (evtType) {
            case "action":
                body = e.data.action
                if ( e.data.validation ){
                    details +=`<div><label style="color:#070">🔎 Validate:</label> <span style="font-style: italic">${valueToHtml(e.data.validation)}</span></div>`;
                }
                break;
            case "validation":
                body = e.data.condition;
                break;
            case "note":
                body = e.data.text;
                break;
        }
        return (details.trim().length>0) ? StepElement(title, body, details) : StepElement(title, body);
    }
    
    function createXlsBookStep( e ) {
        let evtType = e.data.type;
        let title = `${TYPE_TO_TITLE[evtType]} (${e.data.session})`;
        let body = "";
        let details = e.data.details || "";
        
        switch (evtType) {
            case "action":
                body = e.data.action
                if ( e.data.validation ){
                    details +=`🔎 Validate: ${e.data.validation}`;
                }
                break;
            case "validation":
                body = e.data.condition;
                break;
            case "note":
                body = e.data.text;
                break;
        }
        return (details.trim().length>0) ? StepElement(title, body, details) : StepElement(title, body);
    }

    function addTestBookStep( e, format ) {
        format = format || "html";
        if ( allEvents.contains(e) ) {
            TEST_SCENARIO.addElement( (format==="qc-xls" ? createXlsBookStep(e) : createHtmlBookStep(e) ) );
            return true;
        } else {
            return false;
        }
    }
    return {
        defineUser: makeSession,
        any: allEvents,
        addTestBookStep:addTestBookStep
    };
})();
