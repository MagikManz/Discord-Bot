const Command = {
  alias: [],
  description: 'Unban command',
  func: async ({ Client, member, message, channel, mentions }) => {
    if (mentions.length < 1) return

    const target = mentions[0]
    message.shift()
    if (!target) return

    const reason = message.join(' ')
    let success = true
    await channel.guild.members.unban(target, reason).catch((e) => {
      success = false
      if (e.code === 10013 || e.code === 10026) return channel.send(`${member}, \`${target}\` is not a valid ID or they're not banned.`)
    })
    if (!success) return

    Client.giveFeedback(channel, 'unban', 'I think I unbanned the user. (hopefully!)', 'https://cdn.discordapp.com/emojis/777849453834928148.png?v=1', 'Unbanned')
  }
}

module.exports = Command
