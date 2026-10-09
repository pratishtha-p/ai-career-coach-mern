# AI Career Coach

A full-stack web app that reviews your résumé, writes interview questions for your target role, and builds a learning roadmap sized to the time you have. Built with the MERN stack and Google Gemini.

<!-- Add 2-3 screenshots here: ![Landing](docs/landing.png) ![Résumé review](docs/resume.png) -->

## Features
- **Résumé review:** upload a PDF or paste text and get a score out of 100, strengths, fixes, missing keywords and applicant-tracking tips.
- **Interview practice:** technical, behavioural and situational questions for a role and level, each with what the interviewer is checking.
- **Learning roadmap:** sequential phases based on your weeks and hours per week, each ending in a portfolio project.
- **Saved history:** every result is stored per user and can be reopened or deleted.
- **Authentication:** register and log in with bcrypt-hashed passwords and JWT sessions.

## Tech stack
| Layer | Tools |
|---|---|
| Frontend | React 18, Vite, React Router, plain CSS |
| Backend | Node.js, Express, Multer, pdf-parse, express-rate-limit |
| Database | MongoDB with Mongoose |
| AI | Google Gemini (JSON-mode responses) |
| Auth | JWT, bcryptjs |

## Getting started
You need Node.js 18+, a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster and a [Gemini API key](https://aistudio.google.com/apikey).

```bash
git clone <your-repo-url>
cd ai-career-coach-mern
npm run install:all          # installs server and client dependencies
cp server/.env.example server/.env   # then fill in the values
npm install                  # installs the root dev tool (concurrently)
npm run dev                  # API on :5000, app on :5173
```

Or run each part on its own: `npm run dev --prefix server` and `npm run dev --prefix client`.

### Environment variables (`server/.env`)
| Name | Purpose |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign tokens |
| `GEMINI_API_KEY` | Key from Google AI Studio |
| `GEMINI_MODEL` | Model name, default `gemini-2.5-flash` |
| `CLIENT_URL` | Allowed frontend origin (CORS), default `http://localhost:5173` |
| `PORT` | API port, default `5000` |

## API
All `/api/ai` routes need an `Authorization: Bearer <token>` header.

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/me` | Current user |
| POST | `/api/ai/resume` | Review a résumé (multipart: `resume` PDF or `resumeText`, `targetRole`) |
| POST | `/api/ai/interview` | Generate interview questions |
| POST | `/api/ai/roadmap` | Generate a learning roadmap |
| GET | `/api/ai/history` | List saved results |
| DELETE | `/api/ai/history/:id` | Delete a saved result |

## Project structure
```
server/
  index.js              app setup, CORS, rate limiting
  routes/               auth.js, ai.js
  models/               User, Analysis
  middleware/auth.js    JWT verification
  services/gemini.js    the only file that calls Gemini
client/src/
  pages/                Landing, Auth, Dashboard
  components/           one file per feature, results.jsx renders AI output
```

## Deployment
- **Database:** MongoDB Atlas (allow your host's IP, or `0.0.0.0/0` for a demo).
- **API:** deploy `server/` to Render or Railway. Set the environment variables above and `CLIENT_URL` to your frontend URL.
- **Frontend:** deploy `client/` to Vercel or Netlify with build command `npm run build` and output directory `dist`. Set `VITE_API_URL` to your API URL. Add a rewrite of all paths to `/index.html` so React Router works on refresh.

## License
MIT
