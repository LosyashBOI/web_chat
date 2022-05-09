import {
    closeWindow,
    openConfirmation,
    logOut,
    openSettings,
    sendMessage,
    UI_ELEMENTS,
    showMessageHistory, createMessage,
} from "./view-chatik.js";
import {currentUser, token} from "./storage.js";
import Cookies from "js-cookie";
import {socket} from "./socket";
import {format} from "date-fns";

async function sendEmail() {
    const url = 'https://mighty-cove-31255.herokuapp.com/api/user';
    const emailAddress = {
        email: UI_ELEMENTS.AUTHORIZATION_INPUT.value
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(emailAddress)
        });

        if (!response.ok) {
            throw new Error('Invalid email');
        } else {
            openConfirmation();
        }
    } catch (e) {
        alert(e);
    }
    // console.log(response);
}

function getCode() {
    const code = UI_ELEMENTS.CONFIRMATION_INPUT.value;
    try {
        if (!!code) {
            Cookies.set('token', code);

            UI_ELEMENTS.CONFIRMATION_INPUT.value = '';
            UI_ELEMENTS.MODAL.style.display = 'none';
            UI_ELEMENTS.CONFIRMATION_WINDOW.style.display = 'none';

            return code;
        } else {
            throw new Error('Введите код');
        }
    } catch (e) {
        alert(e);
    }
}

async function changeUsername() {
    const url = 'https://mighty-cove-31255.herokuapp.com/api/user';
    const newName = {
        name: UI_ELEMENTS.USERNAME_INPUT.value
    };

    try {
        await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${Cookies.get('token')}`
            },
            body: JSON.stringify(newName),

        });
    } catch (e) {
        alert(e);
    }
}

async function getNewUsername() {
    const url = 'https://mighty-cove-31255.herokuapp.com/api/user/me';

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`
            }
        });
        const json = await response.json();

        // console.log(json);
        if (response.ok) {
            Cookies.set('currentUser', json.name);
            console.log(currentUser);

        }
    } catch (e) {
        alert(e)
    }
}
export async function getMessageHistory() {
    const url = 'https://mighty-cove-31255.herokuapp.com/api/messages';
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${Cookies.get('token')}`
        }
    });

    const messages = await response.json();

    return messages;
}

export function getTime(time) {
    return format(new Date(time), 'HH:mm')
}

function getOlderMessages() {
    const scroll = UI_ELEMENTS.CHAT_OUTPUT;
    let count = 20;

    if (scroll.scrollTop < 100) {
        count *= 2;
        showMessageHistory(count, true);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    showMessageHistory(20);
});
UI_ELEMENTS.SETTINGS_BUTTON.addEventListener('click', openSettings);
UI_ELEMENTS.LOG_OUT_BUTTON.addEventListener('click', logOut);
UI_ELEMENTS.CHAT_SUBMIT.addEventListener('click', sendMessage);
UI_ELEMENTS.AUTHORIZATION_SUBMIT.addEventListener('click', sendEmail);
UI_ELEMENTS.CONFIRMATION_SUBMIT.addEventListener('click', getCode);
UI_ELEMENTS.USERNAME_SUBMIT.addEventListener('click', changeUsername);
UI_ELEMENTS.USERNAME_SUBMIT.addEventListener('click', getNewUsername);
UI_ELEMENTS.CHAT_SCROLL.addEventListener('scroll', getOlderMessages);
// UI_ELEMENTS.CHAT_SCROLL.addEventListener('scroll', () => {
//     console.log(UI_ELEMENTS.CHAT_SCROLL.scrollTop);
// });
socket.onmessage = function(event) {
    const messageData = JSON.parse(event.data);

    const message = createMessage(messageData.user.name, messageData.createdAt, 'companion', messageData.text);
    UI_ELEMENTS.CHAT_OUTPUT.append(message);
    // console.log(message);
}

for (let btn of UI_ELEMENTS.CLOSE_WINDOW) {
    btn.addEventListener('click', closeWindow);
}