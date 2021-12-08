import {App, PluginSettingTab, Setting} from "obsidian";
import BudgetPlugin from './main'

export interface BudgetPluginSettings {
	previewModeSwitchDelay: string;
}

export const DEFAULT_SETTINGS: BudgetPluginSettings = {
	previewModeSwitchDelay: '3',
}

export class BudgetSettings extends PluginSettingTab {
    plugin: BudgetPlugin;

	constructor(app: App, plugin: BudgetPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

    display(): void {
        const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Link Favicons'});

    new Setting(containerEl)
        .setName('Preview Mode Switch Delay')
        .setDesc('The number of seconds of inaction before the file is shown in preview mode. Must be a number.')
        .addText(text => text
            .setValue(this.plugin.settings.previewModeSwitchDelay)
            .setPlaceholder('3')
            .onChange(async (value) => {
                this.plugin.settings.previewModeSwitchDelay = value;
                await this.plugin.saveSettings();
                
            }));
    }
}