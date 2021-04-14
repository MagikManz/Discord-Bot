const Discord = require('discord.js')

const Client = new Discord.Client()

const recurseWead = require('recursive-readdir')
const secret = require('./secret.json')

Client.prefix = '!'
Client.commands = {}
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

Client.login(secret.token)
