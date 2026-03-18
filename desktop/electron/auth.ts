import { google } from 'googleapis'
import { shell, safeStorage } from 'electron'
import * as http from 'http'
import * as url from 'url'
import * as dotenv from 'dotenv'
import { join } from 'path'
import * as fs from 'fs'

dotenv.config({ path: join(__dirname, '../.env') })

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000'

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
)

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/gmail.readonly'
]

// Support storing token securely
const TOKEN_PATH = join(process.env.APPDATA || '', 'amie-clone', 'token.json')

export const authAPI = {
  isLoggedIn: () => {
    return fs.existsSync(TOKEN_PATH)
  },

  login: async () => {
    return new Promise((resolve, reject) => {
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent'
      })

      const server = http.createServer(async (req, res) => {
        try {
          if (req.url?.indexOf('/?code=') !== -1) {
            const qs = new url.URL(req.url!, 'http://localhost:3000').searchParams
            const code = qs.get('code')
            
            res.end('Authentication successful! You can close this window.')
            server.close()

            const { tokens } = await oauth2Client.getToken(code!)
            oauth2Client.setCredentials(tokens)
            
            // Store token securely (encrypted on Windows)
            if (!fs.existsSync(join(TOKEN_PATH, '..'))) {
              fs.mkdirSync(join(TOKEN_PATH, '..'), { recursive: true })
            }
            
            const encryptedToken = safeStorage.isEncryptionAvailable() 
              ? safeStorage.encryptString(JSON.stringify(tokens)).toString('base64')
              : JSON.stringify(tokens)
              
            fs.writeFileSync(TOKEN_PATH, encryptedToken)
            
            resolve(true)
          }
        } catch (e) {
          res.end('Authentication failed.')
          server.close()
          reject(e)
        }
      }).listen(3000)

      shell.openExternal(authUrl)
    })
  },

  logout: () => {
    if (fs.existsSync(TOKEN_PATH)) {
      fs.unlinkSync(TOKEN_PATH)
    }
    oauth2Client.setCredentials({})
    return true
  },

  getAuthClient: () => {
    if (fs.existsSync(TOKEN_PATH)) {
      const data = fs.readFileSync(TOKEN_PATH, 'utf-8')
      const tokens = safeStorage.isEncryptionAvailable()
        ? JSON.parse(safeStorage.decryptString(Buffer.from(data, 'base64')))
        : JSON.parse(data)
      oauth2Client.setCredentials(tokens)
    }
    return oauth2Client
  }
}
