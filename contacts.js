import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function listContacts() {
	try {
		const data = await fs.readFile(contactsPath, "utf8");
		return JSON.parse(data);
	} catch (err) {
		console.error("Error reading contacts:", err);
		return [];
	}
}

let allContacts = null;
async function getAllContacts() {
	if (!allContacts) {
		allContacts = await listContacts();
	}
	return allContacts;
}

async function getContactById(contactId) {
	try {
		const contacts = await getAllContacts();
		console.log("Looking for ID:", contactId);
		const contact = contacts.find(
			(contact) => contact.id === contactId.toString()
		);
		console.log("Found Contact:", contact);
		return contact || null;
	} catch (err) {
		console.error("Error getting contact by ID:", err);
		return null;
	}
}

async function removeContact(contactId) {
	try {
		const contacts = await getAllContacts();
		const contactToRemove = contacts.find(
			(contact) => contact.id === contactId.toString()
		);
		console.log("Found Contact:", contactToRemove);
		if (!contactToRemove) {
			console.log(`Contact with ID ${contactId} not found.`);
			return;
		}
		const filteredContacts = contacts.filter(
			(contact) => contact.id !== contactId.toString()
		);
		await fs.writeFile(contactsPath, JSON.stringify(filteredContacts, null, 2));
		console.log(`Contact with ID ${contactId} has been removed.`);
	} catch (err) {
		console.error("Error removing contact:", err);
	}
}

async function addContact(name, email, phone) {
	try {
		const contacts = await listContacts();
		const newContact = { id: Date.now().toString(), name, email, phone };
		contacts.push(newContact);
		await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
		console.log(`Contact ${name} has been added.`);
	} catch (err) {
		console.error("Error adding contact:", err);
	}
}

async function displayContactsAsTable() {
	try {
		const contacts = await listContacts();
		console.table(contacts);
	} catch (err) {
		console.error("Error displaying contacts as table:", err);
	}
}

const contactsService = {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	displayContactsAsTable,
};

export default contactsService;
