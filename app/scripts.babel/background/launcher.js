'use strict';

import { getJobs } from './parser';
import { check } from './checker';
import Projects from './../models/projects.model'
import MyNotification from './notifications';

class Launcher {
  constructor(){
    this.timeToCheck = 60 * 1000;
    this.interval = null;
    this.ProjectsModel = new Projects();
  }

  work(){
    getJobs()
      .then(jobs => jobs.map(check))
      .then(jobs => jobs.filter(job => job.suitable))
      .then(jobs => jobs.map(job => job.project))
      .then(jobs => jobs.reverse())
      .then(jobs => jobs.filter(this.ProjectsModel.isNewProject.bind(this.ProjectsModel)))
      .then(jobs => { jobs.forEach(this.ProjectsModel.addProject.bind(this.ProjectsModel)); return jobs})
      .then(jobs => { jobs.forEach(MyNotification.newProject); return jobs})
      .then(this.ProjectsModel.save.bind(this.ProjectsModel));
  }
  
  start(){
    this.work();
    this.interval = setInterval(this.work.bind(this), this.timeToCheck)
  }
  
  stop(){
    clearInterval(this.interval);
  }

}

export default Launcher;