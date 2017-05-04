var restify=require('restify');
var builder=require('botbuilder');

var server=restify.createServer();

server.listen(1212,function() {
    console.log("%s listening to %s",server.name,server.url);
});

var connector=new builder.ChatConnector({
    appId:'',
    appPassword:''
});

var bot=new builder.UniversalBot(connector);
server.post('/',connector.listen());


bot.dialog('/', [
    function (session) {
        session.beginDialog('/start', session.userData);
    }
]);

bot.dialog('/start',[
    function (session) {
        builder.Prompts.text(session, "Hello... What's your name?");
    },
    function (session, results) {
        session.userData.name = results.response;
        builder.Prompts.number(session, "Hi " + results.response + ", How many months have you been coding?"); 
    },
    function (session, results) {
        session.userData.coding = results.response;
        builder.Prompts.choice(session, "What language do you code Node using?", ["JavaScript" , "TypeScript" , "VbScript"]);
    },
    function (session, results) {
        session.userData.language = results.response.entity;
        builder.Prompts.text(session, "which company you are working now!");
    },
    function (session, results) {
        session.userData.company = results.response;
        builder.Prompts.confirm(session, "do you want to learn another language?");
    },
    function (session, results) {
        console.log(results.response);
        if(results.response==true){
        session.userData.resp = results.response;
            builder.Prompts.text(session, "which language do you want to learn");
        } else {
            session.send("will see later");
            session.endDialog("bye bye");
        }

    },
    function (session, results) {
        session.userData.newLang = results.response;
        session.send("Got it... " + session.userData.name + 
                     " you've been programming for " + session.userData.coding + 
                     " months and use " + session.userData.language + "."+"  You are intrested to study "+
                     session.userData.newLang+"."+" Your company is "+session.userData.company+".");
                     session.endDialog("will see later");
    }



    ]);
