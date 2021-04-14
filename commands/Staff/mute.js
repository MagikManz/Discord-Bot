const noticeMsg = 'You have been muted in [name].'
const timeRegex = /[\d+]+[mhdw]/g
const timeFormat = {
  m: ['Minute', 60000],
  h: ['Hour', 3.6e+6],
  d: ['Day', 8.64e+7],
  w: ['Week', 6.048e+8]
}

const Command = {
  alias: [],
  description: 'Mute command',
  func: async ({ Client, member, mentions, message, channel }) => {
    if (mentions.length < 1) return

    const target = mentions[0]

    const currentDate = new Date()
    const senderId = member.id

    const mutedRole = channel.guild.roles.cache.find((role) => role.name === 'Muted')
    if (!mutedRole) return

    message.shift() // Remove the target mention
    timeRegex.lastIndex = 0

    const time = message[0].match(timeRegex)
    const caseID = Math.random().toString(36).substring(10)

    let muteTime = (time && message[0]) || 'Eternity'
    let unmuteAt = 'Unknown'
    let muteTimeSecs

    // The greatest way of handling time!
    if (time) {
      message.shift()
      let muteMessage = ''
      let muteT = 0
      time.forEach((t, i) => {
        let stamp = t.match(/[\d]+/g)
        if (!(stamp && stamp[0])) return

        stamp = stamp[0]
        let format = t[stamp.length]
        format = timeFormat[format]
        if (!format) return

        muteT += format[1] * stamp
        const last = i === time.length - 1
        let decidedText = ((last && i > 0 && 'and ') || '') + `${stamp} ${format[0]}${(stamp > 1 && 's') || ''}`
        if (last) {
          decidedText += '.'
        } else {
          decidedText += ', '
        }

        muteMessage += decidedText
      })

      muteTime = muteMessage
      unmuteAt = new Date((new Date()).getTime() + muteT)
      if (unmuteAt.toGMTString() === 'Invalid Date') {
        unmuteAt = 'Unknown'
        muteTime = 'Eternity'
      } else {
        muteTimeSecs = unmuteAt.getTime()
        unmuteAt = unmuteAt.toGMTString()

        Client.intervals[caseID] = {
          time: muteTimeSecs,
          guild: channel.guild.id,
          run: ({ guild }) => {
            const gTarget = guild.members.cache.get(target.id)
            if (gTarget && gTarget.roles.cache.get(mutedRole.id)) {
              gTarget.roles.remove(mutedRole, 'Unmuted automatically.')
            }
          }
        }
      }
    }

    if (message.length < 1) message = ['No reason specified.']

    const muteReason = message.join(' ')

    /* eslint-disable camelcase */
    const muteEmbed = {
      content: '',
      embed: {
        color: 8238467,
        timestamp: currentDate.toString(),

        author: {
          name: 'Moderation Action',
          icon_url: 'https://cdn.discordapp.com/attachments/778562386063917086/831646271462834216/shut_up_dino.png'
        },

        fields: [
          {
            name: 'Notice:',
            value: noticeMsg.replace('[name]', channel.guild.name)
          },
          {
            name: 'Muted By:',
            value: `<@${senderId}> (${senderId})`
          },
          {
            name: 'Muted At:',
            value: currentDate.toUTCString()
          },
          {
            name: 'Muted for:',
            value: muteTime
          },
          {
            name: 'Unmuted at:',
            value: unmuteAt
          },
          {
            name: 'Mute Reason:',
            value: muteReason
          }
        ]
      }
    }
    /* eslint-enable camelcase */

    await target.roles.add(mutedRole, `Muted by: ${member.user.username}\n - For: ${muteReason}`)
    Client.giveFeedback(channel, 'mute', 'No more talking for this person :zipper_mouth:')
    target.send(muteEmbed).catch(() => {})
  }
}

module.exports = Command
