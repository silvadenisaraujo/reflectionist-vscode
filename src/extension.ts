import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const REFLECTIONS_FILE_NAME = 'reflection.md';
const HOME_DIR = os.homedir();

/**
 * Reflect command that asks reflective questions and stores in the reflections file.
 */
async function reflectCommand() {
	let selection  = await vscode.window.showQuickPick(['😀 Happy', '🙂 Okay', '😡 Angry', '😔 Sad'], {
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
	const header = `\n------\nDay: ${today.getUTCDate()}/${today.getUTCMonth() + 1}/${today.getFullYear()}`;
	const body = `- Feeling: ${selection}\n- Reason: ${reason}\n- Learned: ${learned}\n- Tomorrow: ${tomorrow}\n- Help: ${help}\n`;
	const reflection = `${header}\n${body}`;
	const fileExists = fs.existsSync(filePath);
	if (!fileExists) {
		fs.writeFileSync(filePath, reflection);
	} else {
		fs.appendFileSync(filePath, reflection);
	}
	vscode.window.showInformationMessage('Reflection saved! 💭');
}

/**
 * Open the reflections file in the active text editor.
 */
async function openCommand() {
	const filePath = path.join(HOME_DIR, REFLECTIONS_FILE_NAME);
	const fileExists = fs.existsSync(filePath);
	if (fileExists) {
		vscode.window.showTextDocument(vscode.Uri.file(filePath));
	} else {
		vscode.window.showInformationMessage('No reflections found.');
	}
}

/**
 * Delete the reflections file.
 */
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

/**
 * Registers a command in the current extension context.
 * @param context Extensions context that will be used to register commands.
 * @param commandName Name of the command that matches the command in the package.json file.
 * @param func Function to call when command is activated.
 */
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

/**
 * Called when extension is activated
 * @param context 
 */
export async function activate(context: vscode.ExtensionContext) {
	await activateCommands(context);
}

// called when extension is deactivated
export function deactivate() {}
