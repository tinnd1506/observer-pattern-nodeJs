const express = require("express")
const app = express()
app.use(express.json())
const db = require("./db")
const port = 3000

const Observable = require("./Observable")
const logSubscriber = require("./subscribers/logSubscriber")
const notifySubscriber = require("./subscribers/notifySubscriber")
const emailSubscriber = require("./subscribers/emailSubscriber")
const databaseLogSubscriber = require("./subscribers/databaseLogSubscriber")

const observable = new Observable()
observable.subscribe(logSubscriber)
observable.subscribe(notifySubscriber)
observable.subscribe(emailSubscriber)
observable.subscribe(databaseLogSubscriber)

const validateResource = require("./middleware/validateResource");

app.post("/", validateResource, (req, res) => {
	const { name, createdAt } = req.body

	if (!name || !createdAt) {
		return res.status(400).json({ message: "Name and createdAt are required" })
	}

	const newData = { name, createdAt }

	console.log("Resource created:", newData)

	// Notify all subscribers
	observable.notify(newData)

	res.status(201).json({ message: "Resource created", data: newData })
})

// Endpoint: Get all resources
app.get("/", (req, res) => {
	db.all(`SELECT * FROM resources`, [], (err, rows) => {
		if (err) {
			console.error("Error fetching resources:", err.message)
			return res.status(500).json({ message: "Error fetching resources" })
		}
		res.json({ data: rows })
	})
})

// Endpoint: Update a resource
app.put("/:id", validateResource, (req, res) => {
	const { id } = req.params;
	const { name, createdAt } = req.body;

	db.run(
		`UPDATE resources SET name = ?, createdAt = ? WHERE id = ?`,
		[name, createdAt, id],
		function (err) {
			if (err) {
				return res.status(500).json({ message: "Error updating resource" });
			}
			if (this.changes === 0) {
				return res.status(404).json({ message: "Resource not found" });
			}
			res.json({ message: "Resource updated" });
		}
	);
});

// Endpoint: Delete a resource
app.delete("/:id", (req, res) => {
	const { id } = req.params;

	db.run(`DELETE FROM resources WHERE id = ?`, id, function (err) {
		if (err) {
			return res.status(500).json({ message: "Error deleting resource" });
		}
		if (this.changes === 0) {
			return res.status(404).json({ message: "Resource not found" });
		}
		res.json({ message: "Resource deleted" });
	});
});

app.listen(port, () => {
	console.log(`Running here ... http://localhost:${port}/`)
})
