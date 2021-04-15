const Discord = require('discord.js')

const Client = new Discord.Client()

const recurseWead = require('recursive-readdir')
const secret = require('./secret.json')

Client.prefix = '!'
Client.commands = {}
Client.messages = {} // for snipe
Client.intervals = {}
Client.giveFeedback = async (channel, command, text, thumbnail, other) => {
  command = command[0].toUpperCase() + command.slice(1)
  const embed = new Discord.MessageEmbed()
    .setColor('#ff0309')
    .setTitle(`Successfully ${other || ((command[command.length - 1] !== 'e' && command + 'ed') || command + 'd')} user!`)
    .setAuthor(`${command} Request`)
    .setDescription(text || 'Successfuly moderated')
    .setThumbnail(thumbnail || 'https://cdn.discordapp.com/emojis/777791562205102110.png?v=1')
    .setFooter(`Random Bot Feedback | ${command} Command`)
    .setTimestamp();
  (await channel.send(embed)).delete({ timeout: 20000 })
}

Client.on('ready', () => {
  console.log('Ready, friend.')

  Client.user.setStatus('dnd')
  recurseWead('./commands', (err, files) => {
    if (err) { console.error(err); return }

    files.forEach((file) => {
      const [, permissionLevel, fileName] = file.replace(/\\/g, '/').split('/')
      const commandName = fileName.substr(0, fileName.length - 3)
      const cmd = require(`./${file}`)

      // Seg keeps complaining, he won't STFU!!
      Client.commands[commandName] = {
        permissionLevel: permissionLevel,
        info: cmd.description,
        alias: cmd.alias,
        run: cmd.func
      }

      if (cmd.alias) {
        cmd.alias.forEach((name) => {
          Client.commands[name] = Client.commands[commandName]
        })
      }
    })
  })

  // Will be changed later lol (to a database)
  console.log('Setting up guild caches')
  Client.guilds.cache.each((guild) => {
    Client.intervals[guild.id] = {}
    Client.messages[guild.id] = {}
  })
})

Client.on('message', (msg) => {
  const {
    guild,
    channel,
    member,
    mentions: { members: mentionMembers }
  } = msg
  if (!(guild && channel && member && msg.content.startsWith(Client.prefix))) return

  const mentions = mentionMembers.array()
  const message = msg.content.substr(Client.prefix.length).split(' ')
  const command = Client.commands[message[0]?.toLowerCase()]
  if (!command) return

  message.shift()
  if (!member.roles.cache.find((role) => role.name === command.permissionLevel)) return

  command.run({ Client, member, mentions, message, channel })
})

Client.on('messageUpdate', (_, msg) => {

})

Client.on('messageDelete', (msg) => {
  const {
    guild,
    member,
    content,
    createdAt
  } = msg
  if (!(guild && member && content && createdAt)) return

  Client.messages[guild.id].deleted = { member: member, content: content, createdAt: createdAt }
  setTimeout(() => {
    if (Client.messages[guild.id].deleted.content === content) delete Client.messages[guild.id].deleted
  }, 30000)
})

Client.on('messageUpdate', (oMsg, msg) => {
  const {
    guild,
    member,
    content,
    createdAt
  } = msg
  if (!(guild && member && content && createdAt)) return

  Client.messages[guild.id].edited = { member: member, oContent: oMsg.content, content: content, createdAt: createdAt }
  setTimeout(() => {
    if (Client.messages[guild.id].edited.content === content) delete Client.messages[guild.id].edited
  }, 30000)
})

Client.login(secret.token)

// The most terrible solution I have come up with, for now. Keeping up with intervals in memory...
setInterval(async () => {
  const currentTime = new Date().getTime()
  const intervals = Client.intervals
  for (const guildid in intervals) {
    for (const interval in intervals[guildid]) {
      const intervalData = intervals[guildid][interval]
      if (!intervalData.time || currentTime < intervalData.time) continue

      const guild = Client.guilds.cache.get(guildid)
      if (!guild) { delete intervals[guildid]; continue }

      console.log('RAN!')
      intervalData.run({ guild, member: guild.members.cache.get(Client.user.id), reason: 'Automated System Action' })
      delete intervals[guildid][interval]
    }
  }
}, 1000)
