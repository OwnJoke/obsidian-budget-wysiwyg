import { App, MarkdownView, Plugin, PluginSettingTab, Setting, debounce } from 'obsidian';
import {DEFAULT_SETTINGS, BudgetPluginSettings, BudgetSettings} from "./settings";

export default class BudgetPlugin extends Plugin {
	settings: BudgetPluginSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new BudgetSettings(this.app, this));

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
			let classname = document.activeElement.className
			let placeholder = document.activeElement.getAttribute('placeholder')
			if(placeholder === 'Type to start search...') {
				return
			}
			if(classname === 'prompt-input' || classname === 'view-header-title') {
				return
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
		// Settings takes number of seconds, debounce takes ms
		const timeout = Number(this.settings.previewModeSwitchDelay) * 1000;
		let debouncef = debounce(doneTyping, timeout, true)

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
