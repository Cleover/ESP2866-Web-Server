let flow = {
    start: [{
            "message": "Welcome...",
            "button": "Hello.",
        },
        {
            "message": "Hi. [ERROR]",
            "button": "Error?",
        },
        {
            "message": "Im missing some information...",
            "button": "Can I help?",
        },
        // {
        //     "message": "Whats your preferred name",
        //     "button": "Alright I put it in!",
        //     "input": "Whats your preferred name?"
        // },
    ],

    cont: [{
            "message": "Hello [name]",
            "button": "Why was this listed in my wifi?",
        },
        {
            "message": "To meet new people.",
            "button": "Oh? How so?",
        },
        {
            "message": "You clicked it didn't you.",
            "button": "What now?",
        },
        {
            "message": "Lets change it up.",
            "button": "Ok...",
        },
        {
            "message": "Lets try to<delete=me.",
            "button": "Wait what?",
        },
        {
            "message": "CONFIRM DELETION..?",
            "input": "CONFIRM DELETION..?",
            "button": "[CONFIRM ANSWER]",
            "options": ["yes_deleted", "no_deleted"]
        },
    ],

    yes_deleted: [{
            "message": "DELETED.",
            "button": "...",
        }, {
            "message": "Did you really think that would work?",
            "button": "Oh..",
        },
        {
            "goto": "end",
        },
    ],



    yes_deleted: [{
            "message": "That was a test...",
            "button": "Did I pass?",
        }, {
            "message": "No.",
            "button": "Oh.",
        },
        {
            "goto": "end",
        },
    ],

    no_deleted: [{
        "message": "That was a test, you passed.",
        "button": "Why did you do that.",
    }, {
        "message": "To know if I could trust you.",
        "button": "Alright...",
    }, ],

    end: [{
        "message": "Goodbye",
        "button": "------------",
        "set": [{
            "name": "lock",
            "value": true
        }]
    }, ],
}