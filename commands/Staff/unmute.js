const Command = {
  alias: [],
  description: 'Unmute command',
  mention: true,
  func: async ({ Client, member, mentions, message, channel }) => {
    if (mentions.length < 1) return

    const target = mentions[0]
    const guild = channel.guild
    const interval = Client.intervals[guild.id][target.id]
    if (!interval) return

    message.shift() // Remove the target mention
    if (interval.run) interval.run({ guild, member, reason: message })

    delete Client.intervals[guild.id][target.id]
  }
}

module.exports = Command
