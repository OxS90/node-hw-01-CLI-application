import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import contactsService from "./contacts.js";

const argv = yargs(hideBin(process.argv)).argv;

async function invokeAction({ action, id, name, email, phone }) {
	switch (action) {
		case "list":
			await contactsService.displayContactsAsTable();
			break;

		case "get":
			const contact = await contactsService.getContactById(id);
			if (contact) {
				console.log(contact);
			} else {
				console.log(`Contact with ID ${id} not found.`);
			}
			break;

		case "add":
			await contactsService.addContact(name, email, phone);
			break;

		case "remove":
			await contactsService.removeContact(id);
			break;

		default:
			console.warn("\x1B[31m Unknown action type!");
	}
}

invokeAction(argv);
