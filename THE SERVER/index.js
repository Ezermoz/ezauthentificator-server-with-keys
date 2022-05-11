/*
    ___________      ___   __  __________  _________   _______________________________  __________  ____ 
    / ____/__  /     /   | / / / /_  __/ / / / ____/ | / /_  __/  _/ ____/  _/ ____/   |/_  __/ __ \/ __ \
   / __/    / /     / /| |/ / / / / / / /_/ / __/ /  |/ / / /  / // /_   / // /   / /| | / / / / / / /_/ /
  / /___   / /__   / ___ / /_/ / / / / __  / /___/ /|  / / / _/ // __/ _/ // /___/ ___ |/ / / /_/ / _, _/ 
 /_____/  /____/  /_/  |_\____/ /_/ /_/ /_/_____/_/ |_/ /_/ /___/_/   /___/\____/_/  |_/_/  \____/_/ |_|  
                                                                                                          
---------------------------------------------------------*/
const config = require("./config.json")
const prefix = config.prefix
const port = config.port

//---------------------------------------------------------
const Discord = require("discord.js")
const client = new Discord.Client()
const db = require('quick.db')
const path = require('path');
const express = require('express')
const { Webhook, MessageBuilder } = require('discord-webhook-node');
const hook = new Webhook(config.logswebhook);
const app = express()
const http = require('http')

client.on('ready', async () => {
    console.log('bot: '+client.user.tag)
})
var rand = require("generate-key");

client.on('message', message => {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    if(!message.author.id === [config.author1, config.author2, config.author3, config.author4]) return
        if(message.guild.id != config.serverid) return
            if(message.channel.id != config.channelid) return
                if(message.content.startsWith(prefix+'createKey')){
                var ip = args[1]
                adminKey = args[2]
                if(!ip){return message.channel.send('error: key dont send')}
                if(!adminKey){return message.channel.send('error: admin key dont send')}
                if(adminKey != config.adminKey) {return message.channel.send("the admin token is not good :c")}
                
                message.channel.send('🛒 Creating keys... ')
                var keyy = rand.generateKey(400);
                message.channel.send("✔️ The keys is ```"+keyy+'```')
                message.channel.send("Send request in api...")
                http.get(`http://${config.url}:${port}/ckeyy/`+keyy+"&"+ip)
                }
            
        
})

client.on('message', message => {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    if(!message.author.id === [config.author1, config.author2, config.author3, config.author4]) return
    if(message.guild.id != config.serverid) return
    if(message.channel.id != config.channelid) return
            
        if(message.content.startsWith(prefix+'removeKey')){
            var key = args[1]
            adminKey = args[2]
            console.log('Bot try to connect to the api to delete key !')
            if(!key){return message.channel.send('error: key dont send')}
            if(!adminKey){return message.channel.send('error: admin key dont send')}
            if(adminKey != config.adminKey) {return message.channel.send("the admin token is not good :c")}

            var alrd = db.fetch(`${key}_`)
            
            if(alrd){
            message.channel.send('🛒 Removing keys... ')
            message.channel.send("Send request in api...")
            http.get(`http://${config.url}:${port}/rkeyy/`+key)
            }else{
                message.channel.send('❌ The customer key is not available !')
            }
    }
})
app.get('/key/:id', function(req, res) {
    //send https://[...]/key&ip
    let value = req.params.id.split("&")//https://[...]/ ->key&ip of requester

    var shearch1 = db.fetch(`${value[0]}_`)//key&ip

    var shearch2 = db.fetch(`key_${value[0]}`)//ip

    if(!shearch2) return res.sendFile(path.join(__dirname, './data/bad.json'));
    if(!shearch1) return res.sendFile(path.join(__dirname, './data/bad.json'));
    
    if(shearch2 != value[1]){ console.log("qq as essayé de fraude avec l'ip !") 
    res.sendFile(path.join(__dirname, './data/nooo.json'));
   return hook.send(`**keys fraud !** \nKEYS\`\`\`${value[0]}\`\`\`\n\**IP DEDICATE**\n\`\`\`${value[1]}\`\`\``)
    }
    if(!shearch2) return res.sendFile(path.join(__dirname, './data/bad.json'));
    if(!shearch1) return res.sendFile(path.join(__dirname, './data/bad.json'));
     hook.send(`**keys login !** \nKEYS\`\`\`${value[0]}\`\`\`\n\**IP DEDICATE**\n\`\`\`${value[1]}\`\`\``)
      
      res.sendFile(path.join(__dirname, './data/good.json'));
          });


// KEYS CREATOR API
          app.get('/ckeyy/:id', function(req, res) {
            let value = req.params.id.split("&")
            db.set("key_"+value[0], value[1])
            db.set(`${value[0]}_`, `${req.params.id}`)

           hook.send(`**New keys create !** \nKEYS\`\`\`${value[0]}\`\`\`\n\**IP DEDICATE**\n\`\`\`${value[1]}\`\`\``)    
           console.log('Succefully create a keys !')       
            res.send('uwu')
                });
// REMOVE KEYS API
                app.get('/rkeyy/:id', function(req, res) {
                    var result = req.params.id
                    var shearch1 = db.fetch(`${result}_`)//key&ip
                    var shearch2 = db.fetch(`key_${result}`)//ip
                    let result_value = result.split("&")
                        if(shearch1){
                            if(shearch2) {
                                db.delete(`${result}_`)
                                db.delete(`key_${result}`)
                                hook.send(`** keys deleted !** \nKEYS\`\`\`${result_value[0]}\`\`\`\n\**IP DEDICATE**\n\`\`\`${shearch2}\`\`\``)
                                return console.log('Succefully deleted keys !')
                            }
                        }else{
                            console.log('attemp fail for remove a key :/')
                        }
                        });

client.login(config.botToken)

app.listen(port, () => {
    console.log(`[SERVER] >> The server is online on the port: `+port)
  })
  //made by ezermoz
  //inspirate is not skid
  //anti-skid