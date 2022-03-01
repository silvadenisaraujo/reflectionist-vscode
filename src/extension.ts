// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const REFLECTIONS_FILE_NAME = 'reflection.md';
const HOME_DIR = os.homedir();

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
async function reflectCommand() {
	let selection  = await vscode.window.showQuickPick(['Happy', 'Okay', 'Angry', 'Sad'], {
		placeHolder: 'How are you feeling now?',
		canPickMany: false
	});

	let reason = await vscode.window.showInputBox({
		prompt: 'Why are you feeling this way?'
	});

	let learned = await vscode.window.showInputBox({
		prompt: 'What did you learn today?'
	});

	let tomorrow = await vscode.window.showInputBox({
		prompt: 'What do you need to do tomorrow?'
	});

	let help = await vscode.window.showInputBox({
		prompt: 'Who can you help tomorrow?'
	});

	const filePath = path.join(HOME_DIR, REFLECTIONS_FILE_NAME);
	const today = new Date();
	const header = `------\nDay: ${today.getUTCDate()}/${today.getUTCMonth() + 1}/${today.getFullYear()}`;
	const body = `- Feeling: ${selection}\n- Reason: ${reason}\n- Learned: ${learned}\n- Tomorrow: ${tomorrow}\n- Help: ${help}\n`;
	const reflection = `${header}\n${body}`;
	const fileExists = fs.existsSync(filePath);
	if (!fileExists) {
		fs.writeFileSync(filePath, reflection);
	} else {
		fs.appendFileSync(filePath, reflection);
	}
	vscode.window.showInformationMessage('Reflection saved! 💪');
}

async function openCommand() {
	const filePath = path.join(HOME_DIR, REFLECTIONS_FILE_NAME);
	const fileExists = fs.existsSync(filePath);
	if (fileExists) {
		vscode.window.showTextDocument(vscode.Uri.file(filePath));
	} else {
		vscode.window.showInformationMessage('No reflections found.');
	}
}

async function deleteCommand() {
	const filePath = path.join(HOME_DIR, REFLECTIONS_FILE_NAME);
	const fileExists = fs.existsSync(filePath);
	if (fileExists) {
		fs.unlinkSync(filePath);
		vscode.window.showInformationMessage('Reflections deleted.');
	} else {
		vscode.window.showInformationMessage('No reflections found.');
	}
}

function registerCommand(
	context: vscode.ExtensionContext,
	commandName: string,
	func: (...args: any[]) => any
): void {
	context.subscriptions.push(
		vscode.commands.registerCommand(commandName, func)
	);
}

async function activateCommands(context: vscode.ExtensionContext): Promise<void> {
	registerCommand(context, 'reflectionist.reflect', reflectCommand);
	registerCommand(context, 'reflectionist.open', openCommand);
	registerCommand(context, 'reflectionist.delete', deleteCommand);
}

// called when extension is activated
export async function activate(context: vscode.ExtensionContext) {
	await activateCommands(context);
}

// called when extension is deactivated
export function deactivate() {}
