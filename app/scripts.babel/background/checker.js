'use strict';
import Options from './../models/options.model';

function isPhraseInField(project, phrasesStr, field) {
  return !!phrasesStr.split(',')
    .map(phrase => phrase.replace(/(^\s+|\s+$)/g,'') )
    .map(phrase => phrase.toLowerCase() )
    .find(phrase => !!(project[field].toLowerCase().indexOf(phrase) + 1));
}

function isCountryInCountries(countries, country) {
  country = country === 'null' ? null : country;

  if (Array.isArray(countries)) {
    return !!countries.find( arrElem => arrElem == country);
  } else if (typeof countries ===  'string') {
     return countries === country;
  }
}

class Checker {
   constructor(project, options) {
     this.project = project;
     this.options = options;
     
     this.reason = [];
     this.suitable =  this.isSuitable();
   }
   /**
    *  project.type 2 - hourly, 1 - fixed
    */
   checkProjectType(){
     let answer = false;
     let projectType = this.project.type == 2 ? 'hourly' : 'fixedPrice';
     let optionType = this.options.type;

     if (optionType == 'any' || optionType == projectType) {
       answer = true;
     }

     if (!answer) {
       this.reason.push(`Не подходит по типу. Тип проекта ${projectType}, а нужен ${optionType}`);
     }
     
     return answer
   }

   /**
    *  project.amount.amount
    */
   checkBudget(){
     let answer = true;

     let projectType = this.project.type == 2 ? 'hourly' : 'fixedPrice';
     
     if (projectType == 'fixedPrice') {
       let projectBudget = parseInt(this.project.amount.amount, 10);

       let budgetMin = parseInt(this.options.budgetMin, 10) || false;
       let budgetMax = parseInt(this.options.budgetMax, 10) || false;

       if (budgetMin && (budgetMin >= projectBudget)) {
         answer = false;
       }

       if (budgetMax && (budgetMax <= projectBudget)) {
         answer = false;
       }

       if (!answer) {
         this.reason.push(`Не подходит по бюджету. Бюджет ${projectBudget}, а ваши рамки от ${budgetMin} до ${budgetMax}`);
       }
     }

     return answer;
   }

   /**
    *  project.description
    *  project.title
    */
   checkPhrases(){
     
     let isIncludedPhraseInDescription = true,
       isIncludedPhraseInTitle = true,
       isExcludedPhraseInDescription = false,
       isExcludedPhraseInTitle = false;

     if (this.options.phrasesContain) {
       isIncludedPhraseInDescription = isPhraseInField(this.project, this.options.phrasesContain, 'description');
       isIncludedPhraseInTitle       = isPhraseInField(this.project, this.options.phrasesContain, 'title');
     }
     if (this.options.phrasesExclude) {
       isExcludedPhraseInDescription = isPhraseInField(this.project, this.options.phrasesExclude, 'description');
       isExcludedPhraseInTitle       = isPhraseInField(this.project, this.options.phrasesExclude, 'title');
     }


     let answer = (isIncludedPhraseInDescription || isIncludedPhraseInTitle) &&
         !(isExcludedPhraseInDescription || isExcludedPhraseInTitle);
     
     if (!answer) {
       if (!(isIncludedPhraseInDescription || isIncludedPhraseInTitle)) {
         this.reason.push(`В описании нет искомых фраз: ${this.options.phrasesContain} `);
       }
       if (isExcludedPhraseInDescription || isExcludedPhraseInTitle) {
         this.reason.push(`В описании есть запрещенные фразы:  ${this.options.phrasesExclude}`);
       }
     }

     return answer; 
   }

   /**
    *  project.client.paymentVerificationStatus      1 - verified 5 - not verified
    */
   checkPaymentVerification(){
     let answer = false;
     let clientVerificationStatus =  parseInt(this.project.client.paymentVerificationStatus, 10) === 5 ? 'verified' : 'not verified';
     let optionsVerificationStatus =  this.options.paymentVerified;

     if (optionsVerificationStatus === 'any' || clientVerificationStatus === optionsVerificationStatus) {
       answer = true;
     }

     if (!answer) {
       this.reason.push(`Не подходит по paymentVerificationStatus. У клиента ${clientVerificationStatus}, а вы ищите ${optionsVerificationStatus}`);
     }
     
     return answer;
   }

   /**
    *  project.client.location.country
    */
   checkCountry(){
     let answer = true;
     let clientCountry = this.project.client.location.country;

     if (this.options.selectExclude) {
       answer = !isCountryInCountries(this.options.selectExclude, clientCountry);
       if (!answer) {
         this.reason.push(
           `Не подходит по стране. Клиент из ${clientCountry}, 
           черный список ${this.options.selectExclude}`
         );
       }
     }
     
     return answer;
   }

   /**
    * project.client.totalFeedback
    */
   checkFeedback(){
     let clientFeedback = parseInt(this.project.client.totalFeedback, 10) || 0;
     let optionFeedback = parseInt(this.options.feedbackStars, 10) || 0;
     let answer = optionFeedback <= clientFeedback;
     
     if (!answer) {
       this.reason.push(`Не подходит по отзывам. У клиента ${clientFeedback}, а вы ищите больше чем ${optionFeedback}`);
     }
     return  answer; 
   }

   checkProject(){
     return this.checkProjectType() && this.checkBudget() && this.checkPhrases();
   }

   checkClient(){
     return this.checkPaymentVerification() && this.checkCountry() && this.checkFeedback();
   }

   isSuitable(){
    return this.checkProject() && this.checkClient();
   }
 }

export function check(project) {
  let options = Options.get();
  return new Checker(project, options);
}


/*
hourly=on
fixedPrice=on
budgetMin=11
budgetMax=22
phrasesContain=11111111,111111111
phrasesExclude=2222222,22222,22222
paymentVerified=on
selectInclude=Afghanistan
selectInclude=Albania
selectInclude=Algeria
selectInclude=Angola
selectInclude=Anguilla
selectInclude=Antarctica
selectExclude=Afghanistan
selectExclude=Albania
selectExclude=Algeria
selectExclude=Aruba
selectExclude=Austria
selectExclude=Bahamas
feedbackStars=5
*/

/*
amount: {
   amount:0
   currencyCode:"USD"
}

category2: "Web, Mobile & Software Dev"
ciphertext:"~01f616e2cb20c6d143"
client: {
 feedbackText:"4.71 Stars, based on 3 feedbacks"
 location: {

 }

 memberSince:"2015-11-15T00:00:00+0000"
 paymentVerificationClass:"o-top-spend"
 paymentVerificationStatus:1
 paymentVerificationTitle:"Payment Method Verified, over $24,606 spent↵22 Total postings, 8 hires.↵Member Since 11/15/2015↵Location: Bedford United States↵ID: 207506578"
 totalFeedback:4.7124049946
 totalHires:8
 totalHiresText:" Total Hires: 8 "
 totalPostedJobs:22
 totalReviews:3
 totalSpent: {

 }
}


contractorTier:1
createdOn:"2016-04-28T10:52:41+00:00"
description:"We are looking for an Angular developer to help us with creating an AngularJS application from a set of wireframes and a prebuilt set of services.↵↵MUST HAVE SKILLS:↵1. Proficient with AngularJS, jQuery, HTML, CSS↵2. Some knowledge of C#, ASP.NET MVC, ASP.NET Web API↵3. Web deployments / IIS configuration ↵4. Strong verbal and written communication skills"
duration:"1 to 3 months"
engagement: "30+ hrs/week"
feedback: {
   feedback:""
}



freelancersToHire:1
isSaved:false
jobStatus:0
maxAmount: {
 amount:0
 currencyCode:"USD"
 }



recno:207506578
relevance:"{"$hours_inactive":"0.0","effective_candidates":"0","id":"207506578","publish_time":"1461840764000","recommended_effective_candidates":"0","unique_impressions":null}"
skills:Array[11]
subcategory2:"Other - Software Development"
tierText:"Entry Level ($)"
title:"Angualr JS developer"
type:2

*/
