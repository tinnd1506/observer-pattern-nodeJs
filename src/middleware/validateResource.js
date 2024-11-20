function validateResource(req, res, next) {
	const { name, createdAt } = req.body;
	if (!name || !createdAt) {
		return res.status(400).json({ message: "Name and createdAt are required" });
	}
	if (typeof name !== 'string' || typeof createdAt !== 'string') {
		return res.status(400).json({ message: "Invalid data types" });
	}
	next();
}

module.exports = validateResource; 