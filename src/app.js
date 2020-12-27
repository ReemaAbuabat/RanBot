import { RTMClient } from '@slack/rtm-api'
import { SLACK_OAUTH_TOKEN } from './constants';
import { WebClient } from '@slack/web-api';


const rtm = new RTMClient(SLACK_OAUTH_TOKEN);
const web = new WebClient(SLACK_OAUTH_TOKEN);

var mentionName ='';
var enterDeadline = false;
var enterNames = false;
var enterMentions = false;
var WhatToEnter = false;
var userId ;


rtm.start()
.catch(console.error);

rtm.on('ready', async () => {
console.log('bot started')
// sendMessage('#general', '/task site test')
});



rtm.on('slack_event', async (eventType, event) => {

    if(event && event.type === 'message'){

        if(event.text === 'help?'){

            enterDeadline = false;
            enterNames = false;
            enterMentions = false;
            WhatToEnter = false;
            userId = event.user;



            console.log(userId)

             sendMessage('do you want to assign anyone ?(yes, no)', event.channel);
            enterMentions = true;


                checkMention( function(){


                    checkNames(function(){
   
                        checkDeadline(function(){
                            
                        });
   
                   });
               });
        
             

            console.log('end ')
            return;

             
            
        }

    

    }

});
async function sendMessage( message, channel){

    // await web.chat.postMessage({
    //     channel: channel,
    //     text: message,


    // });

    console.log('i will post '+message)
    await web.chat.postEphemeral({
        channel: channel,
        text: message,
        user: userId,

    });
    console.log('i posted '+message)
   
}   



  async function checkMention(callback){
    enterNames = false;
    enterMentions = false;


   await rtm.on('slack_event', async (eventType, event) => {

        if(event && event.type === 'message'){


            console.log('first Q')

            if(event.text === 'yes' && userId === event.user){
                console.log('if yes')

                  await sendMessage('who do you want to assign ?', event.channel);
                 console.log('yes posted')

                enterMentions = false;
                enterNames = true;
                WhatToEnter = true;
               
                console.log('callcack')
                callback();

            }else if(event.text === 'no' && userId === event.user){
                

                console.log('if no')

                enterMentions = false;
                enterNames = false;
                WhatToEnter = false;

                await sendMessage('when is the deadline for Ex: 5 PM, 8:30 AM', event.channel);
          
                console.log('no opsted & callback')
                callback()
                return;
             


            }
            return
           
        }


    });

}
 async function checkNames(callback){

    enterDeadline = false;
    enterMentions = false;

    if(!enterNames){
        enterDeadline = true;
        callback();
        console.log('enterName is !')
        return

    }
    await rtm.on('slack_event',  async (eventType, event) => {

        if(event && event.type === 'message'){

            console.log('second Q')

 

            if(enterNames && userId === event.user){
                mentionName = event.text
                console.log('names are'+ mentionName)
    
                 await sendMessage('when is the deadline for Ex: 5 PM, 8:30 AM', event.channel);
                enterNames = false;
                console.log('deadline posted')

                enterDeadline = true;
          
                console.log('callback in dead')
                callback()
                return


            }

           
        }

    });
    return
}

 async function checkDeadline(callback){
            enterNames = false;
            enterMentions = false;
    await rtm.on('slack_event', async (eventType, event) => {

        if(event && event.type === 'message'){


            if(enterDeadline && userId === event.user){

                var deadlineToCheck = event.text
                console.log('deadline  '+ deadlineToCheck)
    
                if(WhatToEnter){
                     await sendMessage('/task '+ mentionName + ' configure site at '+ deadlineToCheck , event.channel);

                }else{
                    await sendMessage('/task configure site at '+ deadlineToCheck , event.channel);

                }
                console.log('last msg posted')

                enterDeadline = false;
                console.log('finall')
                callback();
                return;

    
            }
            return
           
        }

    });
}



