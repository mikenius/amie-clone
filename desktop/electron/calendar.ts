import { google } from 'googleapis'
import { authAPI } from './auth'

export const calendarAPI = {
  /**
   * Fetches events from primary calendar between timeMin and timeMax.
   */
  listEvents: async (timeMin?: string, timeMax?: string) => {
    const auth = authAPI.getAuthClient()
    const calendar = google.calendar({ version: 'v3', auth })

    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin || new Date().toISOString(),
      timeMax: timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    })

    return res.data.items || []
  }
}
