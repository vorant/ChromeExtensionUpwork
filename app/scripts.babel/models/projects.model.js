'use strict';

const _storageField = 'Projects';


class Projects {
  constructor() {
    this.maxProjects = 20;
    this.idField = 'recno';
    
    this.projects = this.get();
  }
  
  deleteOld() {
    this.projects = this.projects.filter((project, index) => index <= this.maxProjects);
  }

  isNewProject(project){
    return !this.projects.find(existedProject => existedProject[this.idField] == project[this.idField])
  }
  
  addProject(project) {
    project.isNew = true;
    this.projects.unshift(project);
  }

  save(){
    this.deleteOld();
    localStorage[_storageField] = JSON.stringify(this.projects);
  }

  get(){
    let projects = [];
    try {
      let str = localStorage[_storageField] || '[]';
      projects = JSON.parse(str);
    } catch(e){
      
    }
    return  projects;
  }

}

export default Projects;