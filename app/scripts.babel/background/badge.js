'use strict';
class Badge {
  static set(text){
    text = text == 0 ? '' : text;
    chrome.browserAction.setBadgeBackgroundColor({color: '#26a69a'})
    chrome.browserAction.setBadgeText({text: `${text}`});
  }
}

export default Badge;

