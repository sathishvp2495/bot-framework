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
    function(session){
    session.beginDialog('/conversation');
    }
    ])

bot.dialog('/conversation',[
    function(session) {
        builder.Prompts.text(session, "***Hi, What is your name***");  
    },
    function(session,results) {
        if(isNaN(results.response)){
        session.userData.name=results.response;
        console.log(session.userData.name);
        session.beginDialog('/company'); 
    } else {
        session.send("your answer is wrong!");
        session.beginDialog('/conversation');
    }
    }
    ])

bot.dialog('/company',[
    function(session) {
        builder.Prompts.text(session, "***Hi*** "+session.userData.name+"***, may i know your company name***");
    },
    function(session,results) {
        if(isNaN(results.response)){
        session.userData.company=results.response;
        session.beginDialog('/age');
    } else {
        session.send("your answer is wrong!");
        session.beginDialog('/company');
    }
    }
    ]);


bot.dialog('/age',[
    function(session) {
        builder.Prompts.number(session,session.userData.name+" ***what's your age now!***");
    },
    function(session,results) {
        session.userData.age=results.response;
        session.beginDialog('/place'); 
    }
    ]);


bot.dialog('/place',[
    function(session) {
        builder.Prompts.text(session," ***which is your favourite place*** "+session.userData.name);
    },
    function(session,results) {
        if(isNaN(results.response)){
        session.userData.place=results.response;
        session.beginDialog('/mobile');
    } else {
        session.send("your anser is wrong");
        session.beginDialog('/place');
    }
    }
    ]);

bot.dialog('/mobile',[
    function(session) {
        session.send(session.userData.place+" ***is also my favourite place. And i like a lot!***")
        builder.Prompts.text(session,"***ok*** "+session.userData.name+" ***which mobile you are using now!***");
    },
    function(session,results) {
        if(isNaN(results.response)){
        session.userData.mobile=results.response;
        session.beginDialog('/game');
    } else {
        session.send("your answer is wrong !!");
        session.send("enter your mobile brand");
        session.beginDialog('/mobile');
    }
    }
    ]);

bot.dialog('/game', [
    function(session) {

        builder.Prompts.text(session," ***what is your favourite game*** "+session.userData.name);
    },
    function(session,results) {
        session.userData.game=results.response;
        session.beginDialog('/fullDetails');
    }
    ])



bot.dialog('/fullDetails',[
     function (session) {
        builder.Prompts.confirm(session," ***see the results :*** ");
        // session.endDialog("***Your full details*** ");
    },
    function (session, results) {
        session.userData.detail=results.response;
        var detail=session.userData.detail
        var card = createCard(detail, session);
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
    }
    ]);

function createCard(detail, session) {
            return createReceiptCard(session);
}


function createReceiptCard(session) {
    return new builder.ReceiptCard(session)

        .title('Your Details')
        .items([
            builder.ReceiptItem.create(session, session.userData.name, 'Name'),

            builder.ReceiptItem.create(session, session.userData.age, 'Age'),

            builder.ReceiptItem.create(session, session.userData.company, 'Company'),

            builder.ReceiptItem.create(session, session.userData.mobile, 'Mobile'),

            builder.ReceiptItem.create(session, session.userData.game, 'Game'),

            builder.ReceiptItem.create(session, session.userData.place, 'Place')
                ])
}
