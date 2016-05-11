import Options from '../models/options.model';
import WorkMode from '../models/workMode.model';
import Projects from '../models/projects.model';
import Authorization from '../models/authorization.model';

export function setDefaultParameters(){
  let options = [
    {name:"type",             value:"any"},
    {name:"budgetMin",        value:""},
    {name:"budgetMax",        value:""},
    {name:"phrasesContain",   value:""},
    {name:"phrasesExclude",   value:""},
    {name:"paymentVerified",  value:"any"},
    {name:"feedbackStars",    value:"0.00"},
    {name:"optionsTime",      value:"1.00"},
    {name:"notification",     value:"on"},
    {name:"notificationSound",value:"on"}
  ];
  Options.save(options);

  let workMode = false;
  WorkMode.save(workMode);

  let authorization = false;
  Authorization.save(authorization);
  
  new Projects().save();
}
