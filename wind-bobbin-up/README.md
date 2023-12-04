# Wind the Bobbin Up

A model for demonstrating how to use ManualLib using the famous nursery rhyme [https://en.wikipedia.org/wiki/Wind_the_Bobbin_Up]("Wind the Bobbin Up"). The model consists of a high-level flow modeled using a state machine ([spec/js/main-flow.js](spec/js/main-flow.js)), and a low-level manual instructions containing the text and activities for each verse ([spec/js/manual-instructions.js](spec/js/manual-instructions.js)).

Also of note are the test book generator file ((meta-spec/book-writer.js)[meta-spec/book-writer.js]), which shows how to generate test book steps for ManualLib events, and the ensemble file ((meta-spec/ensemble-code.js)[meta-spec/ensemble-code.js]), showing how to refer to ManualLib events without requesting them.

More info and library reference available [../](here).