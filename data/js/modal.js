function open_modal() {
    var modal = document.getElementById("modal");
    modal.style.display = "block";

    var elem = document.getElementById('chat');
    elem.scrollTop = elem.scrollHeight;

}

function close_modal() {
    var modal = document.getElementById("modal");
    modal.style.display = "none";
}

function getMessages() {
    return fetch("/$messages").then(response => {
        return response.text();
    })
}

function sendMessage() {

    let msg = document.getElementById('reply').value
    let color_with_tag = document.getElementById('color').value
    let color = color_with_tag.substring(1)

    if (msg.length == 0) return

    console.log(`/$send?message=${msg}&color=${color}`)

    fetch(`/$send?message=${msg}&color=${color}`)

    // Reset the box 
    return document.getElementById('reply').value = ""
}

window.setInterval(function () {
    updateMessages()
}, 1000);

async function updateMessages() {
    let messageList = await getMessages();
    let messages = messageList.split("|")

    var chat = document.getElementById('chat');

    if (chat.children.length < messages.length) {

        for (let i = chat.children.length; i < messages.length; i++) {

            [msg, color] = messages[i].split("<;>")
            chat.innerHTML += `<p style="color:#${color}">${msg}</p>`;
            chat.scrollTop = chat.scrollHeight;

        }
    }
}