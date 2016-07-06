'use strict';

import Launcher from './background/launcher';
import WorkMode from './models/workMode.model';
import {setDefaultParameters} from './background/setDefaultParameters';

chrome.runtime.onInstalled.addListener(setDefaultParameters);


let launcher = new Launcher();

if (WorkMode.get()) { // start launcher when browser begins to work
  launcher.start();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message == 'switch-on') {
    launcher.start();
  }
  if (request.message == 'switch-off') {
    launcher.stop();
  }
  if (request.message == 'reset') {
    if (WorkMode.get()) { 
      launcher.stop();
      launcher.start();
    }
  }
});



