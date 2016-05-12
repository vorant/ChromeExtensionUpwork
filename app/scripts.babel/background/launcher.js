'use strict';

import { getJobs } from './parser';
import { check } from './checker';
import Projects from './../models/projects.model'
import MyNotification from './notifications';
import Options from './../models/options.model';
import Badge from './badge';

let ProjectsModel = new Projects();


class Launcher {
  constructor(){}

  updateParams() {
    let options = Options.get();
    let time = (parseInt(options.optionsTime) || 1) * 1000 * 60;
    
    
    this.timeToCheck = time;
    this.interval = null;
  }

  work(){
    ProjectsModel = new Projects();
    
    getJobs()
      .then(jobs => jobs.map(check))
      .then(jobs => { jobs.forEach(job => console.log(job)); return jobs})
      .then(jobs => jobs.filter(job => job.suitable))
      .then(jobs => jobs.map(job => job.project))
      .then(jobs => jobs.reverse())
      .then(jobs => jobs.filter(job => ProjectsModel.isNewProject(job)))
      .then(jobs => { jobs.forEach(job => ProjectsModel.addProject(job)); return jobs})
      .then(jobs => { jobs.forEach(job => MyNotification.newProject(job, ProjectsModel)); return jobs})
      .then(jobs => { ProjectsModel.save(jobs); return jobs}) 
      .then(jobs => { jobs.forEach(job => chrome.runtime.sendMessage({message: 'newProject', job: job}) ); return jobs})
      .then(jobs => {
        let counter = ProjectsModel.getNewCount();
        Badge.set(counter);
      })
    ;
  }
  
  start(){
    this.stop();
    this.updateParams();
    this.work();
    this.interval = setInterval(this.work.bind(this), this.timeToCheck)
  }
  
  stop(){
    clearInterval(this.interval);
  }

}

export default Launcher;