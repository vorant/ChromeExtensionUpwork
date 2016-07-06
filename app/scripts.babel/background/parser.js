'use strict';
import Ajax from './ajax.js';
import {url} from './url.constant.js';
import Authorization from './../models/authorization.model';

function initParse() {
  return new Ajax()
    .getJobs(url)
    .then(
      result => result,
      error => new Error(`Something Wrong at response ${error}`)
    )
    .then(
      result => { 
        if (Authorization.check(result)) {
          return result;  
        } else {
          throw new Error('Not authorized')
        }
      }
    )
    .then(
      result => {
        try {
           return  JSON.parse(result);
        } catch (e) {
          throw new Error('Can\'t able to parse result', result);
        }
      }
    )
    .catch(error => {
      new Error(`Something Wrong ${error}`)
    });
    // .then(result => []);
}

export function getJobs() {
  return initParse().then(data => {
    let jobs = [];
    if (typeof data === 'object' && Array.isArray(data.results)) {
      jobs = data.results   
    }
    return jobs;
  })
}
