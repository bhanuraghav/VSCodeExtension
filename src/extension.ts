// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "helloworld" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('helloworld.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		const message = 'Hello VS Code for Grammar';
		vscode.window.showInformationMessage(message);
		// vscode.window.showInformationMessage('Hello VSCode from HelloWorld!');
	});

	
	const suggestWords = vscode.languages.registerCompletionItemProvider(
		'plaintext',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

				// get all text until the `position` and check if it reads `console.`
				// and if so then complete if `log`, `warn`, and `error`
				let linePrefix = document.lineAt(position).text.substr(0, position.character);
				if (!linePrefix.endsWith('static:')) {
					return undefined;
				}

				return [
					new vscode.CompletionItem('city', vscode.CompletionItemKind.Method),
					new vscode.CompletionItem('cuisine', vscode.CompletionItemKind.Method),
					new vscode.CompletionItem('date', vscode.CompletionItemKind.Method),
					new vscode.CompletionItem('datetime', vscode.CompletionItemKind.Method),
					new vscode.CompletionItem('time', vscode.CompletionItemKind.Method),
					new vscode.CompletionItem('duration', vscode.CompletionItemKind.Method)
				];
			}
		},
		':' // triggered whenever a ':' is being typed
	);

	context.subscriptions.push(disposable);

	let timeout: NodeJS.Timer | undefined = undefined;


	let activeEditor = vscode.window.activeTextEditor;

	function updateText() {
		if (!activeEditor) {
			return;
		}
		const regExWithEq = /<\w+>\s+=+/g;
		const regExNoEq = /<\w+>+/g;

		const text = activeEditor.document.getText();
		
		const addedRules = [];

		let match;
		while(match = regExWithEq.exec(text)){
			
			let match2
			while(match2= regExNoEq.exec(match[0])){
				let res = match2[0].substring(1,match2[0].length-1);
				addedRules.push(res);
			}
		}

		console.log(addedRules);
	}

	function triggerUpdateText() {
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
		timeout = setTimeout(updateText, 500);
	}

	if (activeEditor) {
		triggerUpdateText();
	}

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			triggerUpdateText();
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			triggerUpdateText();
		}
	}, null, context.subscriptions);
	context.subscriptions.push(suggestWords);

}

// this method is called when your extension is deactivated
export function deactivate() {}
