

import moment from "moment";
import { greetings } from "./constants";

/**
 * get the sentence from a LiveTranscriptionEvent
 * @param {LiveTranscriptionEvent} event
 * @returns {string}
 */
const utteranceText = (event) => {
  const words = event.channel.alternatives[0].words;
  return words.map((word) => word.punctuated_word ?? word.word).join(" ");
};

/**
 * get user messages
 * @param {any[]} messages
 * @returns {any[]}
 */
const getUserMessages = (messages) => {
  return messages.filter((message) => message.role === "user");
};

/**
 * get message we want to display in the chat
 * @param {any[]} messages
 * @returns {any[]}
 */
const getConversationMessages = (messages) => {
  return messages.filter((message) => message.role !== "system");
};

const sprintf = (template, ...args) => {
  return template.replace(/%[sdf]/g, (match) => {
    const arg = args.shift();
    switch (match) {
      case "%s":
        return String(arg);
      case "%d":
        return parseInt(arg, 10).toString();
      case "%f":
        return parseFloat(arg).toString();
      default:
        return match;
    }
  });
};

function randomArrayValue(array){
  const key = Math.floor(Math.random() * array.length);

  return array[key];
};

function contextualGreeting() {
  const greeting = randomArrayValue(greetings);

  return sprintf(greeting.text, ...greeting.strings);
};

/**
 * @returns {string}
 */
function contextualHello() {
  const hour = moment().hour();

  if (hour > 3 && hour <= 12) {
    return "Good morning";
  } else if (hour > 12 && hour <= 15) {
    return "Good afternoon";
  } else if (hour > 15 && hour <= 20) {
    return "Good evening";
  } else if (hour > 20 || hour <= 3) {
    return "You're up late";
  } else {
    return "Hello";
  }
};

/**
 * Generate random string of alphanumerical characters.
 * 
 * @param {number} length this is the length of the string to return
 * @returns {string}
 */
function generateRandomString(length){
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    let randomChar = characters.charAt(Math.floor(Math.random() * characters.length));
    result += randomChar;
  }

  return result;

  return 'test';
}

export {
  generateRandomString,
  contextualGreeting,
  contextualHello,
  getUserMessages,
  getConversationMessages,
  utteranceText
};
