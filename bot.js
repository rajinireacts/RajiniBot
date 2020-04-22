require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});
const ogs = require('open-graph-scraper');
const firebase = require('firebase');
const app = firebase.initializeApp({
  apiKey: "AIzaSyAugoc71iVu4j5WWnM1JN2QVQM0wICCia4",
  authDomain: "chittimicrobase-a0b6a.firebaseapp.com",
  databaseURL: "https://chittimicrobase-a0b6a.firebaseio.com",
  projectId: "chittimicrobase-a0b6a",
  storageBucket: "chittimicrobase-a0b6a.appspot.com",
  messagingSenderId: "927853852015",
});	

const express = require('express');
const path = require("path");
const server = express();
const port = process.env.PORT || 5000;
const gameName = "crorepati";
const gameName = "RobotRunner";
const queries = {};


    i18n = require("i18n");
    
    i18n.configure({
      locales: ['en', 'hi' , 'ta' , 'te' , 'ml'],
      directory: __dirname + '/locales',
      autoReload: true,
      fallbacks:{'nl': 'en'},
      defaultLocale: 'en'
    });
        
    
    // Test Language
    bot.onText(/\/test_i18n/, (msg) => {
    
      if (msg.from.hasOwnProperty('language_code') && msg.from.language_code!=('undefined')) {
        var str = msg.from.language_code.toLowerCase();
        var code = str.substring(0, 2);
        i18n.setLocale(code);
      }
      
      var greeting = i18n.__('Hello {{name}}, how are you today?', { name: msg.from.first_name });
    
      bot.sendMessage(msg.chat.id, greeting, {
          parse_mode: "HTML"
        }
      );
    });	
      
    // Start Message i18n
    bot.onText(/\/start_i18n/, (msg) => {
    
      if (msg.from.hasOwnProperty('language_code') && msg.from.language_code!=('undefined')) {
        var str = msg.from.language_code.toLowerCase();
        var code = str.substring(0, 2);
        i18n.setLocale(code);
      }
      
      var msg_start_1 = i18n.__("Welcome You {{name}}, \nI'm <b>Your BOT</b> and I'm here to help you to find ...", { name: msg.from.first_name });
      var msg_start_2 = i18n.__("\n\nPlease type: \n<b>The name of ...</b>, or\n/list  -  To know the list of... \n/help -  To have support\n/site  -  To visit our website");
      
      bot.sendMessage(msg.chat.id, msg_start_1 + msg_start_2, {
          parse_mode: "HTML"
        }
      );
    });	

// ---------- LOGGIN FEATURES ----------
const XRegExp = require('xregexp');
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'a'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};
// ---------- LOGGIN FEATURES END ----------

// ---------- FAST ANSWERS ----------
var fastAnswers = JSON.parse(fs.readFileSync('./answers.json', 'utf8'));
// ---------- FAST ANSWERS END ----------

console.log("[DEBUG] Bot is starting...");


bot.on('message', (msg) => {  
     //bot.sendMessage(msg.chat.id, "Hello dear user"); 
	 //console.log(msg);
	 let date = new Date(msg.date * 1000);
	 let timestamp = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear() + "@" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
	 
	
	let msgFromInfo = "";
	if(msg.chat.type == "private"){
		msgFromInfo = msg.from.first_name + "(" + msg.from.id + ")";
	}else if(msg.chat.type == "group"){
		msgFromInfo = msg.from.first_name + "(" + msg.from.id + "/" + msg.chat.title + ")";
	}
	
	 console.log("[INFO](" + timestamp + ") Msg from " + msgFromInfo + ": " + msg.text);
	 
	 if(msg.text != null){
		let mex = controlMessage(msg.text);
		if(mex != null){
			//bot.sendMessage(msg.chat.id, mex);
					
			if(mex.type == "text"){
				bot.sendMessage(msg.chat.id, mex.reply);
			}else if(mex.type == "image"){
				if(mex.reply.includes("gif")){
					bot.sendDocument(msg.chat.id, mex.reply);
				}else{
					bot.sendPhoto(msg.chat.id, mex.reply);
				}
			}else if(mex.type == "audio"){
				//bot.sendAudio(msg.chat.id, mex.reply, "Xfox Assistant Bot", "Title", "Caption");
				bot.sendVoice(msg.chat.id, mex.reply);
      }else if(mex.type == "video"){
				bot.sendVideo(msg.chat.id, mex.reply);
      }else if(mex.type == "document"){
				bot.sendDocument(msg.chat.id, mex.reply);
      }else if(mex.type == "function"){
				mex.reply(bot); //let function handle the answer
			}
		 }
	 }
});

function controlMessage(message){
	
	/*
	for (const [key, phrases] of Object.entries(fastAnswers)) { //Check for fast answers
		if(message.toLowerCase().includes(key)){
			let rnd = Math.floor((Math.random() * (phrases.length-1)) + 0);
			return phrases[rnd];
		}
	}
	*/


	let found = null;
	//TODO: Should substitute forEach with for (const [triggers, oneFastAnswer] of Object.entries(fastAnswers)), in order to use return inside the loop
	fastAnswers.forEach(function(fastAnswer){ //For every fast answer
		fastAnswer.triggers.forEach(function(trigger){ //Check among all triggers
			let regex = new XRegExp(trigger, "gui");//Search global and case insenstive
			let regexResult = message.match(regex);
			
		    //console.log("Regex result: " + regexResult);
			
			if((regexResult != null) && !found){ //If RegEx matches and wasn't previously found
				let rnd = Math.floor((Math.random() * (fastAnswer.replies.length)) + 0);
				found = fastAnswer.replies[rnd];
				//return fastAnswer.replies[rnd]; //Can't do this with forEach (ahw man, that sucks), see comment above, substitute forEach with for
			}	
		});
	});
	
	return found;
}

bot.on('message', (msg) => {
var Hi = "hi";
if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
    bot.sendMessage(msg.chat.id, "Hello " + msg.from.first_name);
}
var bye = "bye";
if (msg.text.toString().toLowerCase().includes(bye)) {
    bot.sendMessage(msg.chat.id, "Hope to see you athithia nesan around again , கவிக்குயில் " + msg.from.first_name);
}    
var robot = "athie";
if (msg.text.indexOf(robot) === 0) {
    bot.sendMessage(msg.chat.id, "Yes I'm robot but not in that way!");
    const fileId = getFileIdSomehow();
    bot.sendAudio(chatId, fileId);
}
});

// ---------- Bookmark Code ----------
const ref = firebase.database().ref();
const sitesRef = ref.child("sites");

let siteUrl;
bot.onText(/\/bookmark (.+)/, (msg, match) => {
  siteUrl = match[1];
  bot.sendMessage(msg.chat.id,'Got it, in which category?', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'Development',
          callback_data: 'development'
        },{
          text: 'Music',
          callback_data: 'music'
        },{
          text: 'Cute monkeys',
          callback_data: 'cute-monkeys'
        }
      ]]
    }
  });
});

bot.on("callback_query", (callbackQuery) => {
  const message = callbackQuery.message;
  ogs({'url': siteUrl}, function (error, results) {
    if(results.success) {
      sitesRef.push().set({
        name: results.data.ogSiteName,
        title: results.data.ogTitle,
        description: results.data.ogDescription,
        url: siteUrl,
        thumbnail: results.data.ogImage.url,
        category: callbackQuery.data
      });
      bot.sendMessage(message.chat.id,'Added \"' + results.data.ogTitle +'\" to category \"' + callbackQuery.data + '\"!')
} else {
      sitesRef.push().set({
        url: siteUrl
      });
      bot.sendMessage(message.chat.id,'Added new website, but there was no OG data!');
    }
  });
});

// ---------- Movie Code ----------
var request = require('request');

bot.onText(/\/movie (.+)/,function(msg,match){
    var chatId = msg.chat.id;
    var movie = match[1];
    request(`http://www.omdbapi.com/?apikey=aea138e7&t=${movie}`,function(error,response,body){
        if(!error && response.statusCode == 200){
          bot.sendMessage(chatId, '_Looking for_ ' + movie + '...', {parse_mode:'Markdown'})
          .then(function(msg){
            var res = JSON.parse(body);
            bot.sendPhoto(chatId, res.Poster,{caption: 'Result : \nTitle: ' + res.Title + '\nYear: ' + res.Year + '\nRated: ' + res.Rated + '\nReleased: ' + res.Released});
        })
      }
    });
});

// ---------- nase keyboards ----------
// const url = 'https://launchlibrary.net/1.3/launch';
// const trigger = 'I want to travel!';

// const prepareData = (body) => {
//   const launches = JSON.parse(body).launches;
//   return launches.filter((launch) => launch !== undefined)
//    .map((launch) => `${launch.name} on ${launch.net}`)
//    .join('\n\n');
//  };
//  bot.on('message', (msg) => {
//   if (msg.text.toString() === trigger) {
//    return request(url, (err, resp, body) => {
//     bot.sendMessage(msg.chat.id, prepareData(body));
//    });
//   }
//  bot.sendMessage(msg.chat.id, 'Hi, do you want to travel?', {
//    reply_markup: {
//      keyboard: [[trigger], ['Bulk option']]
//     }
//    }
//   );
//  });

 // ---------- ex reply keyboards ----------

const { ReplyManager } = require("node-telegram-operation-manager");
const keyboardWrapper = require("node-telegram-keyboard-wrapper");

//*************************//
//* EXECUTE THIS, TRUST ME*//
//*************************//
const reply = new ReplyManager();
const keyboards = [
    new keyboardWrapper.ReplyKeyboard("I hate replies"),
    (new keyboardWrapper.ReplyKeyboard()).addRow("I hate replies", "I love replies"),
    new keyboardWrapper.ReplyKeyboard("Show me potatoes!")
];
bot.onText(/\/multireply/, (message) => {
    bot.sendMessage(message.from.id, `Hey there! 😎 Some replies got registered! Follow my instructions to discover how this works. Send me a message now!`);
    // I could use any identifier I want, but I suggest to use user.id.
    // Command is an arbitrary string and optional string
    // If you don't want to pass a command, set it as empty
    reply
        .register(message.from.id, (someData) => {
        bot.sendMessage(message.from.id, "Great! Now send me another message.");
    })
        .register(message.from.id, (someData) => {
        let nextText = "See? You can register your replies easily by setting in your message listener the following check."
            + "\nAssuming you are using [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) and you istantiated globally ReplyManager, you can do it by:"
            + "\n\n```"
            + "\nconst reply = new ReplyManager();"
            + "\nbot.on(\"message\", (msg) => {"
            + "\n\t// this requires the id and let you push optional data in form of object."
            + "\n\tif (reply.expects(msg.from.id)) {"
            + "\n\t\tlet { text, entities } = msg;"
            + "\n\t\treply.execute(msg.from.id, { text, entities });"
            + "\n\t}"
            + "\n});```"
            + "\n\nNow send me this text: \"I hate replies\"";
        let messageOpts = Object.assign({
            parse_mode: "Markdown",
            disable_web_page_preview: true
        }, keyboards[0].open({ resize_keyboard: true }));
        bot.sendMessage(message.from.id, nextText, messageOpts);
    })
        .register(message.from.id, (someData) => {
        let nextText;
        const messageOpts1 = Object.assign({
            parse_mode: "Markdown",
        }, keyboards[1].open({ resize_keyboard: true }));
        const messageOpts2 = Object.assign({
            parse_mode: "Markdown",
        }, keyboards[2].open({ resize_keyboard: true }));
        if (someData.text === "I love replies") {
            nextText = "✔ Good! Conditional checks can use optional data that can be passed at your own discretion through `reply.execute()` (as above)"
                + "\n\nThis is how you can set them:"
                + "\n\n\t\`.add(identifier, (someData?: RegisteredResult) => { ... })\`"
                + "\n\nYou can also set some data to be passed (or accumulated) through replies."
                + " Instead of returning an object with `{ repeat: true }` or _undefined_, return an object with any value you want."
                + "\nFor this example, I'm going to return an object with a property called \"potatoes\"."
                + "\nYou can also return datas from a failed session, inserting in the same object of `{ repeat: true }`, other keys/values."
                + "\n\nNow send me another message with written inside *Show me potatoes!*.";
            bot.sendMessage(message.from.id, nextText, messageOpts2);
            return {
                potatoes: "I like them fried!"
            };
        }
        else {
            nextText = "❌ Great, but the required text in this reply was \"I love replies\"."
                + "\n\nYou can make repeat a reply until it satisfies your conditions by returning `{ repeat: true }` inside the function."
                + "\n\nIf you omit that key or return it as true or omit the full return, the reply will be considered as to not be repeated."
                + "\n\nNow try again. This time try to send me both \"I have replies\" (again) and \"I love replies\" and see what happen.";
            bot.sendMessage(message.from.id, nextText, messageOpts1);
            return { repeat: true };
        }
    })
        .register(message.from.id, (someData) => {
        if (someData.text !== "Show me potatoes!") {
            bot.sendMessage(message.from.id, "Nope! The next is not correct! Try again.");
            return { repeat: true };
        }
        let nextText = "You can access them by using `someData.previousData`."
            + "\nSo, we will access to potatoes by saying: `someData.previousData.potatoes`."
            + "\nAwesome! Isn't it?"
            + "\n\nNow send me another message!";
        bot.sendMessage(message.from.id, nextText, Object.assign({}, keyboards[2].close(), { parse_mode: "Markdown" }));
    })
        .register(message.from.id, (someData) => {
        bot.sendMessage(message.from.id, "You are the best! Start now by looking at the [documentation](https://github.com/alexandercerutti/node-telegram-operation-manager#class_reply). 😉 Hope you have enjoyed the tutorial!", { parse_mode: "Markdown" });
    });
});
bot.on("message", (msg) => {
    // this requires the id and let you push optional data in form of object.
    if (!hasEntity("bot_command", msg.entities) && reply.expects(msg.from.id)) {
        let { text, entities } = msg;
        reply.execute(msg.from.id, { text, entities });
    }
});
function hasEntity(entity, entities) {
    if (!entities || !entities.length) {
        return false;
    }
    return entities.some(e => e.type === entity);
}

 // ---------- games ----------

  bot.onText(/help2/, (msg) => bot.sendMessage(msg.chat.id, "This bot implements a who wants to be a millionaire game. Say /game if you want to play."));
 bot.onText(/game/, (msg) => bot.sendGame(msg.chat.id, gameName));

 //logic 

 bot.on("callback_query", function (query) {
  if (query.game_short_name !== gameName) {
    bot.answerCallbackQuery(query.id, "Sorry, '" + query.game_short_name + "' is not available.");
  } else {
    queries[query.id] = query;
    let gameurl = "https://chittimicrobot.herokuapp.com/index.html?id="+query.id;
    bot.answerCallbackQuery({
      callback_query_id: query.id,
      url: gameurl
    });
  }
});

//inline behavior
bot.on("inline_query", function(iq) {
  bot.answerInlineQuery(iq.id, [ { type: "game", id: "0", game_short_name: gameName } ] );
});

server.use(express.static(path.join(__dirname, 'public')));

//high scores
server.get("/highscore/:score", function(req, res, next) {
  if (!Object.hasOwnProperty.call(queries, req.query.id)) return next();
  let query = queries[req.query.id];
  let options;
  if (query.message) {
    options = {
      chat_id: query.message.chat.id,
      message_id: query.message.message_id
    };
  } else {
    options = {
      inline_message_id: query.inline_message_id
    };
  }
  bot.setGameScore(query.from.id, parseInt(req.params.score),  options,
  function (err, result) {});
});

server.listen(port);

// ---------- game 2 Robot Runner ----------

bot.onText(/game/, (msg) => bot.sendGame(msg.chat.id, gameName));

//logic 

bot.on("callback_query", function (query) {
  if (query.game_short_name !== gameName) {
    bot.answerCallbackQuery(query.id, "Sorry, '" + query.game_short_name + "' is not available.");
  } else {
    queries[query.id] = query;
    let gameurl = "https://chittimicrobot.herokuapp.com/controller.html?id="+query.id;
    bot.answerCallbackQuery({
      callback_query_id: query.id,
      url: gameurl
    });
  }
});

//inline behavior
bot.on("inline_query", function(iq) {
  bot.answerInlineQuery(iq.id, [ { type: "game", id: "0", game_short_name: gameName } ] );
});

server.use(express.static(path.join(__dirname, 'crorepati')));