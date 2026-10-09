const router = require('express').Router();
const multer = require('multer');
const pdf = require('pdf-parse');
const auth = require('../middleware/auth');
const Analysis = require('../models/Analysis');
const { askJSON } = require('../services/gemini');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
router.use(auth);

const save = (user, type, title, input, result) => Analysis.create({ user, type, title, input, result });

router.post('/resume', upload.single('resume'), async (req, res, next) => {
  try {
    const role = (req.body.targetRole || 'Software Engineer').trim();
    let text = req.body.resumeText || '';
    if (req.file) {
      if (req.file.mimetype !== 'application/pdf') return res.status(400).json({ message: 'Upload a PDF file' });
      text = (await pdf(req.file.buffer)).text;
    }
    text = text.trim();
    if (text.length < 80)
      return res.status(400).json({ message: 'We could not read enough text. Paste your résumé text instead.' });

    const result = await askJSON(`You are a senior technical recruiter. Review this résumé for the target role "${role}".
Be specific and honest; refer to actual content from the résumé.
Return JSON exactly in this shape:
{"score": <integer 0-100>, "summary": "<two sentences>", "strengths": ["..."], "improvements": ["..."], "missingKeywords": ["..."], "atsTips": ["..."]}
Give 3-5 items per list.

RÉSUMÉ:
${text.slice(0, 12000)}`);
    res.json(await save(req.userId, 'resume', `${role} résumé review`, { role }, result));
  } catch (e) { next(e); }
});

router.post('/interview', async (req, res, next) => {
  try {
    const { role, level = 'Entry level', focus = '', count = 6 } = req.body;
    if (!role) return res.status(400).json({ message: 'Enter the role you are preparing for' });
    const n = Math.min(Math.max(parseInt(count) || 6, 3), 10);
    const result = await askJSON(`Write ${n} interview questions for a ${level} "${role}" candidate.${focus ? ` Focus on: ${focus}.` : ''}
Mix technical, behavioural and situational questions.
Return JSON exactly in this shape:
{"questions": [{"question": "...", "type": "Technical|Behavioural|Situational", "lookFor": "<what the interviewer is checking>", "outline": "<how a strong answer is structured>"}]}`);
    res.json(await save(req.userId, 'interview', `${role} interview questions`, { role, level, focus }, result));
  } catch (e) { next(e); }
});

router.post('/roadmap', async (req, res, next) => {
  try {
    const { goal, skills = '', weeks = 12, hours = 10 } = req.body;
    if (!goal) return res.status(400).json({ message: 'Enter the role or goal you are working towards' });
    const w = Math.min(Math.max(parseInt(weeks) || 12, 2), 52);
    const result = await askJSON(`Create a ${w}-week learning roadmap for someone aiming to become: "${goal}".
Current skills: ${skills || 'beginner'}. Time available: ${hours} hours per week.
Split it into 3-5 sequential phases. Name resource types or well-known resource names only; never invent URLs.
Return JSON exactly in this shape:
{"title": "...", "summary": "<two sentences>", "phases": [{"name": "...", "weeks": "Weeks 1-3", "focus": "<one sentence>", "topics": ["..."], "project": "<a portfolio project to build>", "resources": ["..."]}]}`);
    res.json(await save(req.userId, 'roadmap', goal, { goal, skills, weeks: w, hours }, result));
  } catch (e) { next(e); }
});

router.get('/history', async (req, res, next) => {
  try { res.json(await Analysis.find({ user: req.userId }).sort('-createdAt').limit(50).select('-input')); }
  catch (e) { next(e); }
});

router.delete('/history/:id', async (req, res, next) => {
  try { await Analysis.deleteOne({ _id: req.params.id, user: req.userId }); res.json({ ok: true }); }
  catch (e) { next(e); }
});

module.exports = router;
