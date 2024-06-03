const vscode = require('vscode');
const jsdoc = require('jsdoc-api');

function activate(context) {

    let disposable = vscode.commands.registerCommand('docguide.generateDocs', function () {
        
        // command registered 
        
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;

            const text = document.getText();
               

            jsdoc.explain({ source: text }).then(docs => {
                const markdown = generateMarkdown(docs);

                const docPanel = vscode.window.createWebviewPanel(
                    'documentation',

                    'Generated Documentation',

                    vscode.ViewColumn.One,
                    {}
                );
                docPanel.webview.html = getWebviewContent(markdown);
               

            }).catch(error => {
                vscode.window.showErrorMessage('Error generating documentation: ' + error.message);
            });
        } else {
             
            vscode.window.showInformationMessage('No active editor found! okay gudu');
        }
    });

    context.subscriptions.push(disposable);
}

vscode.commands.getCommands().then(commands => {
    console.log(commands);
});


function generateMarkdown(docs) {
    let markdown = '# Documentation\n\n';
    docs.forEach(doc => {
        markdown += `## ${doc.longname}\n${doc.description}\n\n`;
    });
    return markdown;
}

function getWebviewContent(markdown) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Generated Documentation</title>
    </head>
    <body>
        ${markdown}
    </body>
    </html>`;
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
