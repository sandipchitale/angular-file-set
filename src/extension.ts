'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

let _statusBarItems = [];

function disposeStatusItems() {
    _statusBarItems.forEach(_statusBarItem => _statusBarItem.dispose());
    _statusBarItems = [];
}

function addStatusItems(editor: vscode.TextEditor) {
    disposeStatusItems();
    if (editor) {
        const fsPath = editor.document.uri.fsPath;

        const fspath = editor.document.uri.fsPath;
        const basename = path.basename(fsPath);
        let matches = basename.match(/(.+)(\.spec\.ts)$/);
        if (matches && matches.length === 3) {
        } else {
            matches = basename.match(/(.+)(\.html|\.scss|\.css|\.ts)$/);
        }
        if (matches && matches.length === 3) {

            let exts = ['.spec.ts', '.html', '.scss', '.css', '.ts'].filter(ext => ext !== matches[2]);

            const dirname = path.dirname(fsPath);
            exts.forEach(ext => {
                if (fs.existsSync(path.join(dirname, matches[1] + ext))) {
                    const _statusBarItem = vscode.window.createStatusBarItem(
                        vscode.StatusBarAlignment.Left,
                        -100000
                    );
                    _statusBarItem.tooltip = 'Open ' + ext;
                    _statusBarItem.text = '$(pencil) ' + ext;
                    _statusBarItem.color = new vscode.ThemeColor('statusBar.foreground');
                    _statusBarItem.command = 'extension.open' + ext;
                    _statusBarItem.show();
                    _statusBarItems.push(_statusBarItem);
                }
            });
        }
    }
}


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    ['.spec.ts', '.html', '.scss', '.css', '.ts'].forEach(ext => {
        let disposable = vscode.commands.registerCommand(
            'extension.open' + ext,
            function () {
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                    const fsPath = editor.document.uri.fsPath;
                    const basename = path.basename(fsPath);
                    let matches = basename.match(/(.+)(\.spec\.ts)$/);
                    if (matches && matches.length === 3) {
                    } else {
                        matches = basename.match(/(.+)(\.html|\.scss|\.css|\.ts)$/);
                    }
                    if (matches && matches.length === 3) {
                        const dirname = path.dirname(fsPath);
                        if (fs.existsSync(path.join(dirname, matches[1] + ext))) {
                            vscode.workspace
                                .openTextDocument(path.join(dirname, matches[1] + ext))
                                .then(doc => vscode.window.showTextDocument(doc, {preview: false}));
                        }
                    }
                }
            }
        );

        context.subscriptions.push(disposable);
    })

    const editor = vscode.window.activeTextEditor;
    if (editor) {
        addStatusItems(editor);
    }
    const activeTextEditorChange = vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            addStatusItems(editor);
        } else {
            disposeStatusItems();
        }
    },
    null,
    context.subscriptions);
}

// this method is called when your extension is deactivated
export function deactivate() {
    disposeStatusItems();
}