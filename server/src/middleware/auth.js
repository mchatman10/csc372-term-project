export function sessionRequired(req, res, next){
  if (!req.session || !req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
  req.user = { id: req.session.userId, email: req.session.email };
  next();
}
