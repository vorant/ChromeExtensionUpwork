'use strict';

import { getJobs } from './parser';
import { check } from './checker';
import Projects from './../models/projects.model'
import MyNotification from './notifications';
import Options from './../models/options.model';

class Launcher {
  constructor(){}

  updateParams() {
    let options = Options.get();
    let time = (parseInt(options.optionsTime) || 1) * 1000 * 60;

    this.timeToCheck = time;
    this.interval = null;
    this.ProjectsModel = new Projects();
  }

  work(){
    
    getJobs()
      .then(jobs => jobs.map(check))
      .then(jobs => { jobs.forEach(job => console.log(job)); return jobs})
      .then(jobs => jobs.filter(job => job.suitable))
      .then(jobs => jobs.map(job => job.project))
      .then(jobs => jobs.reverse())
      .then(jobs => jobs.filter(this.ProjectsModel.isNewProject.bind(this.ProjectsModel)))
      .then(jobs => { jobs.forEach(this.ProjectsModel.addProject.bind(this.ProjectsModel)); return jobs})
      .then(jobs => { jobs.forEach(MyNotification.newProject); return jobs})
      .then(jobs => { this.ProjectsModel.save.bind(this.ProjectsModel)(jobs); return jobs}) 
      .then(jobs => { jobs.forEach(job => chrome.runtime.sendMessage({message: job}) ); return jobs})
    ;
  }
  
  start(){
    this.updateParams();
    this.work();
    this.interval = setInterval(this.work.bind(this), this.timeToCheck)
  }
  
  stop(){
    clearInterval(this.interval);
  }

}

export default Launcher;