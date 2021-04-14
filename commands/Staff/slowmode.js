const Command = {
  alias: ['slow', 'sm'],
  description: 'Slowmode command',
  func: async ({ member, channel, message }) => {
    const time = (message[0] && message.pop()) || 0
    await channel.setRateLimitPerUser(time, (message.join(' ') || 'No reason was specified.') + ` - ${member.user.tag}`)

    channel.send(`I have adjusted slowmode to ${time}`)
  }
}

module.exports = Command
