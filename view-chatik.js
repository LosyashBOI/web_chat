import {getMessageHistory, getTime} from './main-chatik.js';
import {sendMessageToServer} from "./socket.js";

export const UI_ELEMENTS = {
    MODAL: document.querySelector('.modal'),
    SETTINGS_WINDOW: document.querySelector('.modal__element_settings'),
    SETTINGS_BUTTON: document.querySelector('.btn_settings'),
    AUTHORIZATION_WINDOW: document.querySelector('.modal__element_authorization'),
    CONFIRMATION_WINDOW: document.querySelector('.modal__element_confirmation'),
    LOG_OUT_BUTTON: document.querySelector('.btn_log-out'),
    CLOSE_WINDOW: document.querySelectorAll('.btn_close-modal'),
    CHAT_OUTPUT: document.querySelector('.chat__output'),
    CHAT_INPUT: document.querySelector('.input_message'),
    CHAT_SCROLL: document.querySelector('.chat__middle'),
    CHAT_SUBMIT: document.querySelector('.btn_message-submit'),
    AUTHORIZATION_INPUT: document.querySelector('.input_authorization'),
    AUTHORIZATION_SUBMIT: document.querySelector('.btn_authorization-submit'),
    CONFIRMATION_INPUT: document.querySelector('.input_confirmation'),
    CONFIRMATION_SUBMIT: document.querySelector('.btn_confirmation-submit'),
    TEMPLATE_MESSAGE: document.querySelector('.template-message'),
    USERNAME_INPUT: document.querySelector('.input_settings'),
    USERNAME_SUBMIT: document.querySelector('.btn_settings-submit'),
    MESSAGE_AUTHOR: document.querySelector('.message__author'),
}

let isLoading = false;

export function openSettings() {
    UI_ELEMENTS.MODAL.style.display = 'block';
    UI_ELEMENTS.SETTINGS_WINDOW.style.display = 'block';
}

export function logOut() {
    UI_ELEMENTS.MODAL.style.display = 'block';
    UI_ELEMENTS.AUTHORIZATION_WINDOW.style.display = 'block';
}

export function openConfirmation() {
    UI_ELEMENTS.AUTHORIZATION_WINDOW.style.display = 'none';
    UI_ELEMENTS.CONFIRMATION_WINDOW.style.display = 'block';
}

export function closeWindow(event) {
    const modalWindow = event.currentTarget.parentElement.parentElement;

    UI_ELEMENTS.MODAL.style.display = 'none';
    modalWindow.style.display = 'none';
}

export function createMessage(username, time, from, text) {
    const message = document.createElement('div');

    const type = (from === 'me') ? 'sent' : 'delivered'
    message.className = `message message_${from} message_${type}`;
    message.append(UI_ELEMENTS.TEMPLATE_MESSAGE.content.cloneNode(true));
    message.firstElementChild.textContent = username + ': ' + text;
    message.lastElementChild.textContent = getTime(time);

    return message;
}

export function sendMessage() {
    if (UI_ELEMENTS.CHAT_INPUT.value) {
        try {
            sendMessageToServer(UI_ELEMENTS.CHAT_INPUT.value)
        } catch (e) {
            alert(e);
        }
        // createMessage(currentUser, Date.now(), 'me', UI_ELEMENTS.CHAT_INPUT.value);

        UI_ELEMENTS.CHAT_INPUT.value = '';
    }
}

export async function showMessageHistory(visibleMessages, older = false) {
    const messageHistory = await getMessageHistory();
    const amountOfMessages = messageHistory.messages.length - (visibleMessages - 20);

    for (let i = amountOfMessages - 20; i < amountOfMessages; i++) {
        const messageData = {
            username: messageHistory.messages[i].user.name,
            time: messageHistory.messages[i].createdAt,
            text: messageHistory.messages[i].text
        }

        const message  = createMessage(messageData.username, messageData.time, 'companion', messageData.text);

        older ? UI_ELEMENTS.CHAT_OUTPUT.prepend(message) : UI_ELEMENTS.CHAT_OUTPUT.append(message);

        // console.log(messageHistory.messages[i]);
    }
    // UI_ELEMENTS.CHAT_SCROLL.scrollTop = UI_ELEMENTS.CHAT_SCROLL.scrollHeight;
}


