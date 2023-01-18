// general variables
let i = 0;
let preferred_name = ""
// speed variables
let add = 50;
let remove = 65;

// progress variables
let hit = 0
let finished = true

// temp text storage
let text = ""
let button = ""

let input = ""
let options = []

let page = "start"
let folder;
let again = false
let change_button = true

let values = {
    lock: false,
    stats: false,
}

// Add text on screen
function add_text() {
    if (i < text.length) {
        if (/^[a-zA-Z0-9 ]+$/.test(text.charAt(i))) document.getElementById("h1").innerHTML += text.charAt(i);
        else document.getElementById("h1").innerHTML += " ";
        i++;
        if (text.charAt(i) == "<") add = 250
        if (text.charAt(i) == ">") add = 25
        if (text.charAt(i) == "=") add = 50

        console.log(add)

        setTimeout(add_text, add);

    } else {
        if (options.length == 2) {
            option = confirm(input);
            if (option) setPage(options[0])
            else page = setPage(options[1])
            if (change_button) {
                document.getElementById("h2").innerHTML = button
                fade_in()
            }
            i = 0
            input = ""
            options = [];
            finished = true;

        } else if (input != "") {
            preferred_name = prompt(input, "");
            if (preferred_name == null) re_prompt_input()
            else {
                if (change_button) {
                    document.getElementById("h2").innerHTML = button
                    fade_in()
                }
                i = 0
                input = ""
                finished = true;
            }
        } else {
            if (change_button) {
                document.getElementById("h2").innerHTML = button
                fade_in()
            }
            i = 0
            finished = true;
        }


    }
}

function re_prompt_input() {
    document.getElementById("h2").innerHTML = "No Name Entered. Click to Re-Enter"
    if (change_button) fade_in()
    again = true
}

// Remove text on screen
function remove_text() {
    let org = document.getElementById("h1").innerHTML

    if (org.length != 0) {
        document.getElementById("h1").innerHTML = org.slice(0, -1);
        setTimeout(remove_text, remove);
    } else {
        add_text()
        if (change_button) fade_out()
    }

}

// Fade button out
function fade_out() {
    document.getElementById('h2').style.opacity = '0';
}

// Fade button in
function fade_in() {
    document.getElementById('h2').style.opacity = '1';
}

function setPage(page_to_go_to) {
    page = page_to_go_to
    hit = 0
}

function leave(option, skip) {

    if (values.stats) return show_stats();

    if (document.getElementsByClassName(option)[0].style.opacity == "0.3") return

    const buttons = document.getElementById("buttons").children
    for (let child of buttons) {
        if (child.className != option) {
            document.getElementsByClassName(child.className)[0].style.opacity = '0.3';
        }
    }

    document.getElementById("hidden").style.opacity = '1';

    if (folder != option && folder != null) {

        want_to_leave = confirm(`Choosing this option will reset progress on ${folder} and change you over to ${option}, are you sure you want to do this?`)
        if (want_to_leave) {
            page = "start"
            hit = 0
        } else {
            return leave(folder)
        }
    }

    folder = option

    if (again) {
        preferred_name = prompt(input, "");
        if (preferred_name == null) re_prompt_input()
        else {
            fade_out()
            new Promise(resolve => setTimeout(resolve, 350));
            document.getElementById("h2").innerHTML = button
            fade_in()
            i = 0
            input = ""
            again = false
            finished = true;
        }
    } else {

        if (values.lock) return

        if (finished == false) return

        hit++

        if (option == "flow") current = flow[page][hit - 1]
        if (option == "files") current = files[page][hit - 1]
        if (option == "stats") current = stats[page][hit - 1]

        if (current) {
            if (current.set) {
                current.set.forEach(variable => {
                    values[variable.name] = [variable.value]
                });
            }

            if (current.goto) {
                page = current.goto
                hit = 0
                return leave(option)
            } else {
                if (current.input) input = current.input
                if (current.options) options = current.options
                text = current.message.replace("[name]", preferred_name)
                button = current.button
                finished = false;
                remove_text()
            }
        } else {
            // reset hit variable & re-run function
            hit = 0
            return leave(option)
        }
    }
}

function reset() {
    if (document.getElementById("hidden").style.opacity == "0") return
    // const buttons = document.getElementById("buttons").children
    // for (let child of buttons) {
    //     document.getElementsByClassName(child.className)[0].style.opacity = '1';
    // }
    want_to_leave = confirm(`Choosing this option will reset all progress are you sure you want to do this?`)
    if (want_to_leave) location.reload();
}

function show_stats() {

    let buttonNum = 0
    // Change text of all buttons to new options, and change their functions.

    const buttons = document.getElementById("buttons").children
    for (let child of buttons) {
        // each button

        let button = document.getElementsByClassName(child.className)[0]

        switch (buttonNum) {
            case 0:
                button.innerHTML = "Whats the flash size?"
                button.setAttribute("onClick", `returnAPI("flashSize")`);
                button.style.opacity = 1
                break;
            case 1:
                button.innerHTML = "Whats the free heap?"
                button.setAttribute("onClick", `returnAPI("freeHeap")`);
                button.style.opacity = 1
                break;
            case 2:
                button.innerHTML = "Whats the total space?"
                button.setAttribute("onClick", `returnAPI("fsTotalBytes")`);
                button.style.opacity = 1
                break;
            case 3:
                button.innerHTML = "How much space has been used?"
                button.setAttribute("onClick", `returnAPI("fsUsedBytes")`);
                button.style.opacity = 1
                break;
        }

        buttonNum++

    }

    // text = "cleo.la[i]n"
    // button = "Stats Here\nMore Stats\nEven More"
    // finished = false;
    // remove_text()
}

function returnAPI(value) {
    fetch("/$sysinfo").then(response => {
        return response.json();
    }).then(jsonData => {

        message = ""

        if (value == "flashSize") message = "The flash size is"
        if (value == "freeHeap") message = "The free heap"
        if (value == "fsTotalBytes") message = "The total space of the file system is"
        if (value == "fsUsedBytes") message = "The used space on the file system is"

        text = `${message}:\n ${(jsonData[value])/1000000} Megabytes`
        finished = false;
        change_button = false
        remove_text()

    })
}