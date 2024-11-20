class Observable {
	constructor() {
		this.subscribers = []
	}

	// Method to add a subscriber
	subscribe(fn) {
		this.subscribers.push(fn);
	}

	// Method to remove a subscriber
	unsubscribe(fn) {
		this.subscribers = this.subscribers.filter(subscriber => subscriber !== fn);
	}

	// Method to notify all subscribers
	notify(data) {
		this.subscribers.forEach(subscriber => subscriber(data));
	}
}

module.exports = Observable
