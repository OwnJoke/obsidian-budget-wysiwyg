import { App, MarkdownView, Plugin, PluginSettingTab, Setting, debounce, Debouncer } from 'obsidian';

interface BudgetPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: BudgetPluginSettings = {
	mySetting: 'default'
}

export default class BudgetPlugin extends Plugin {
	settings: BudgetPluginSettings;

	async onload() {
		await this.loadSettings();
		const self = this;

		function doneTyping() {
			const activeView = self.app.workspace.getActiveViewOfType(MarkdownView);
			if (!activeView) {
				return;
			}
			let selection = activeView.editor.getSelection()
			if (selection) {
				return;
			}
			cursorpos = activeView.editor.getCursor()
			let viewstate = activeView.leaf.getViewState()
			viewstate.state.mode = 'preview'
			activeView.leaf.setViewState(viewstate)
		}

		this.registerDomEvent(document, 'keydown', (evt: KeyboardEvent) => {
			if(evt.key === 'Control' || evt.key === 'Alt' || evt.key === 'Shift' || evt.key === 'Meta') {
				return;
			}
			const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (!activeView) {
				return;
			}
			if(activeView.getMode() === 'preview'){
				let viewstate = activeView.leaf.getViewState()
				viewstate.state.mode = 'source'
				activeView.leaf.setViewState(viewstate)
    		activeView.editor.focus();
				if(cursorpos) {
					activeView.editor.setCursor({ line: cursorpos.line, ch: cursorpos.ch });
				} else {
					activeView.editor.setCursor(activeView.editor.lastLine());
				}
			}
		});
		let cursorpos: any
		let debouncef = debounce(doneTyping, 2000, true)

		this.registerDomEvent(document, 'mousedown', (evt: MouseEvent) => {
		});

		this.registerDomEvent(document, 'mouseup', (evt: MouseEvent) => {
			debouncef()
		});

		this.registerDomEvent(document, 'keyup', (evt: KeyboardEvent) => {
			if(evt.key === 'Control' || evt.key === 'Alt' || evt.key === 'Shift' || evt.key === 'Meta') {
				return;
			}
			debouncef()
		});
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
