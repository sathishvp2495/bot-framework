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
        session.beginDialog('/q&a',questions[session.dialogData]);

    },
    function (session, results) {
        session.send("Thanks %(name)s... You're %(age)s and located in %(state)s.", results.response);
    }

]);

bot.dialog('/q&a', [
    function (session, args) {
        // Save previous state (create on first call)
        session.dialogData.index = args ? args.index : 0;
        session.dialogData.form = args ? args.form : {};

        // Prompt user for next field
        builder.Prompts.text(session, questions[session.dialogData.index].prompt);
    },
    function (session, results) {
        // Save users reply
        console.log("name = "+results.response);
        console.log("age = "+results.response);
        console.log("state = "+results.response);

        var field = questions[session.dialogData.index++].field;
        session.dialogData.form[field] = results.response;

        // Check for end of form
        if (session.dialogData.index >= questions.length) {
            // Return completed form
            session.endDialogWithResult({ response: session.dialogData.form });
        } else {
            // Next field
            session.replaceDialog('/q&a', session.dialogData);
        }
    }
]);

var questions = [
    { field: 'name', prompt: "What's your name?" },
    { field: 'age', prompt: "How old are you?" },
    { field: 'state', prompt: "What state are you in?" }
];
