StudentDetails =new Mongo.Collection('students');

if (Meteor.isClient) {
	
	Template.board.helpers({
		'studentFinderHistory' : function(){
		var bestHistory = Session.get('bestHistory')
		return bestHistory
		},
		'studentFinderMath' : function(){
		var bestMath = Session.get('bestMath') 
		return bestMath
		},
		'studentFinderEnglish' : function(){
		var bestEnglish = Session.get('bestEnglish')
		return bestEnglish
		}
	});
	
	Template.board.events({
		
		'click .refresh' : function(){
			
			var bestHistoryStudent = StudentDetails.find({},{sort:{historySubject: -1}}).fetch()
			var bestMathStudent = StudentDetails.find({},{sort:{mathSubject: -1}}).fetch()
			var bestEnglishStudent = StudentDetails.find({},{sort:{englishSubject: -1}}).fetch()
			Session.set('bestHistory',bestHistoryStudent)
			Session.set('bestMath',bestMathStudent)
			Session.set('bestEnglish',bestEnglishStudent)
		}
	});
	
	Template.boardForm.events({
		'submit form.input' : function(event,template){
		event.preventDefault();
		var studentNameVar = event.target.studentName.value;
		var studentClassVar = +event.target.studentClass.value;
		var studentAgeVar =  +event.target.studentAge.value;
		var studentMathVar = +event.target.studentMath.value;
		var studentEnglishVar = +event.target.studentEnglish.value;
		var studentHistoryVar = +event.target.studentHistory.value;
		
			StudentDetails.insert({
				name: studentNameVar,
				classIn: studentClassVar,
				age:studentAgeVar,
				mathSubject: studentMathVar,
				englishSubject: studentEnglishVar,
				historySubject: studentHistoryVar
				
			});
		 template.find("form").reset();
		}
	});
  
}

if (Meteor.isServer) {
	// Global API configuration
  var Api = new Restivus({
  apiPath: 'my-api/',
  defaultHeaders: {
      'Content-Type': 'application/json'
    },
    useDefaultAuth: false,
    prettyJson: true
  });

  // Generates: GET, POST on /api/students and GET, PUT, DELETE on
  // /api/students/:id for the StudentDetails collection
  Api.addCollection(StudentDetails);

  // Generates: POST on /api/users and GET, DELETE /api/users/:id for
  // Meteor.users collection
  Api.addCollection(Meteor.users, {
    excludedEndpoints: ['put','delete','post'],
    routeOptions: {
      authRequired: false
    },
    endpoints: {
      get: {
        authRequired: false
      }
    }
  });

  // Maps to: /api/articles/:id
  Api.addRoute('StudentDetails', {authRequired: false}, {
    get: function () {
      return StudentDetails.find().fetch();
    }
        //return {
          //statusCode: 404,
          //body: {status: 'fail', message: 'Article not found'}
        //};
      //}
    //}
  });
}
