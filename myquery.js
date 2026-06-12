/**
 * author: Daniel Bengl
 * version: 1.3
 */
var $ = (function () {
	const myquery = (selector) => {
		if (selector instanceof Document) {
			return {
				ready: (callback) => {
					selector.addEventListener("DOMContentLoaded", callback);
				},
			};
		}
		const element =
			typeof selector == "string"
				? document.querySelector(selector)
				: selector;
		return {
			element,
			selector,
			/**
			 * Adds a EventListener to the element
			 * @param {string} name - event name
			 * @param {Function} callback - function to call
			 * @returns myquery object
			 */
			on(name, callback) {
				element.addEventListener(name, callback);
				return myquery;
			},
			/**
			 * Adds a click EventListener to the element
			 * @param {Function} callback - function to call
			 * @returns myquery object
			 */
			click(callback) {
				this.on("click", callback);
				return myquery;
			},
			/**
			 * Gets or sets dataset attribute of the element
			 * @param {string} key - key of the dataset
			 * @param {*} value - value of the dataset
			 * @returns value of the attribute or dataset
			 */
			data(key, value) {
				if (value != undefined) {
					element.dataset[key] = value;
					return myquery;
				} else if (key != undefined) {
					return element.dataset[key];
				}
				return element.dataset;
			},
			/**
			 * Adds a class to the element
			 * @param {string} className - class name to add
			 * @returns myquery object
			 */
			add(...classNames) {
				classNames.forEach((name) => element.classList.add(name));
				return myquery;
			},
			/**
			 * Removes a class of the element
			 * @param {string} className - class name to remove
			 * @returns myquery object
			 */
			remove(...classNames) {
				classNames.forEach((name) => element.classList.remove(name));
				return myquery;
			},
			/**
			 * Toggles a class of the element
			 * @param {string} className - class name to toggle
			 * @returns myquery object
			 */
			toggleClass(className) {
				element.classList.toggle(className);
				return myquery;
			},
			/**
			 * Appends a child to the element
			 * @param {HTMLElement|String} element - element to append
			 * @returns myquery object
			 */
			append(element) {
				if (element instanceof HTMLElement) {
					this.element.appendChild(element);
				} else {
					this.element.appendChild($.create(element));
				}
				return myquery;
			},
			/**
			 * Appends the element to a parent
			 * @param {HTMLElement|myquery} parent - parent element
			 * @returns myquery object
			 */
			 appendTo(parent) {
				if (parent instanceof HTMLElement) {
					parent.appendChild(element);
				} else {
					parent.append(element);
				}
				return myquery;
			},
			/**
			 * Sets text content of the element
			 * @param {string} text - text to set
			 * @returns text content of the element
			 */
			text(text) {
				if (text != undefined) element.innerText = text;
				return element.innerText;
			},
			/**
			 * Sets innerHTML of the element
			 * @param {string} html - html to set
			 * @returns innerHTML of the element
			 */
			html(html) {
				if (html) element.innerHTML = html;
				return element.innerHTML;
			},
			/**
			 * Sets CSS properties of the element
			 * using key / value pairs or using a style object
			 * @param {string|Object} key 
			 * @param {string} value 
			 * @returns 
			 */
			 css(key, value) {
				if (typeof key == "object") {
					for (let key in style) {
						element.style[key] = style[key];
					}
				} else {
					element.style[key] = value;
				}
				return myquery;
			},
			/**
			 * Hides the element
			 * @returns myquery object
			 */
			hide() {
				element.style.display = "none";
				hidden = true;
				return myquery;
			},
			/**
			 * Shows the element
			 * @returns myquery object
			 */
			show() {
				element.style.display = "";
				hidden = false;
				return myquery;
			},
			/**
			 * Sets the value of the element
			 * @param {*} newValue - value to set
			 * @returns value of the element
			 */
			value(newValue) {
				if (newValue != undefined) element.value = newValue;
				return element.value;
			},
			/**
			 * Toggles the visibility of the element
			 * @returns true if shown, false if hidden
			 */
			toggle() {
				if (element.style.display == "none") {
					myquery.show();
					return true;
				}
				myquery.hide();
				return false;
			},
			/**
			 *TODO: IMPLEMENT LOGIC
			 * @param {string} url
			 * @param {Object} data
			 * @returns
			 */
			ajax(url, { data = {}, method = "GET", beforeSend = () => {}, success = () => {}, error = () => {} }) {
				const xhr = new XMLHttpRequest();
				xhr.open(method, url);
				xhr.onreadystatechange = () => {
					if (xhr.status >= 200 && xhr.status < 300) {
						success(xhr.response);
					} else {
						error(xhr.response);
					}
				}
				xhr.onerror = () => {
					error(xhr.response);
				}
				beforeSend();
				xhr.send(data);
				return myquery;
			},
		};
	};
	/**
	 * Waits a certain amount of time
	 * @param {Number} time
	 * @returns Promise
	 */
	myquery.wait = (milliseconds) =>
		new Promise((resolve) => {
			setTimeout(resolve, milliseconds);
		});
	/**
	 * Creates a POST request to the server
	 * @param {string} url - url of the query
	 * @param {Object} data - data to send
	 * @param {Function} callback - function to call
	 * @returns
	 */
	myquery.post = (url, data = {}, callback = (data, status, xhr) => {}) => {
		const xhr = new XMLHttpRequest();
		xhr.open("POST", url);
		xhr.onload = () => {
			callback(JSON.parse(xhr.responseText), xhr.status, xhr);
		};
		xhr.send(JSON.stringify(data));
	};
	/**
	 * Creates a GET request to the server
	 * @param {string} url - url of the query
	 * @param {Function} callback - function to call
	 * @returns
	 */
	myquery.get = (url, callback) => {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", url);
		xhr.onload = () => {
			callback(xhr.responseText);
		};
		xhr.send();
	};
	/**
	 * Creates a Element from a string
	 * @param {string} html - html to parse
	 * @returns element
	 */
	 myquery.create = (html) => {
		const element = document.createElement("div");
		element.innerHTML = html;
		return element.firstChild;
	};

	return myquery;
})();