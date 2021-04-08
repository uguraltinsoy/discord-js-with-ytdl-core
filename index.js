const { Client } = require('discord.js')
const ytdl = require('ytdl-core')
const client = new Client({ disableEveryone: true })

let PREFIX = '?' // Default Prefix
var voiceChannel = null

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', async message => {
    const args = message.content.substring(PREFIX.length).split(" ")
    const url = args[1] ? args[1].replace(/<(._)>/g, '$1') : ''

    if (message.content.toLocaleLowerCase().startsWith(`${PREFIX}play`)) {
        try {
            voiceChannel = message.member.voice.channel // Channel information of the user who wrote the message
            const permissions = voiceChannel.permissionsFor(message.client.user)
            if (!permissions.has('CONNECT')) return console.log('CONNECT')
            if (!permissions.has('SPEAK')) return console.log('SPEAK')

            play(url)
        } catch (error) {
            console.log(error)
        }
    }
    else if (message.content.toLocaleLowerCase().startsWith(`${PREFIX}stop`)) {
        voiceChannel.leave() // Leave the Sound Channel
        voiceChannel = null // clear "voiceChannel" variable
    }
})

async function play(url) {
    try {
        voiceChannel.join() // Connect to the audio channel
            .then(connection => {
                const dispatcher = connection.play(ytdl(url, { quality: 'highestaudio' }))
                    .on('finish', function(){
                        voiceChannel.leave() // Leave the Sound Channel
                        voiceChannel = null // clear "voiceChannel" variable
                    })
                dispatcher.setVolumeLogarithmic(1 / 5) // Volume Level
            })
    } catch (error) {
        console.log(error)
    }
}

client.login( /* Your Token */)