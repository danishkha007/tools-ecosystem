import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tool } from '../../core/models/tool-data.model';
import { DataService } from '@core/services/data.service';
import { CliTool, Subcommand, CommandOption, CLI_TOOLS } from './command-data';

interface OptionValue {
  enabled: boolean;
  value: string;
  repeatableValues: string[];
}

@Component({
  selector: 'app-command-designer',
  templateUrl: './command-designer.html',
  styleUrls: ['./command-designer.scss'],
  imports: [CommonModule, FormsModule]
})
export class CommandDesignerComponent implements OnInit {
  toolId = 'command-designer';
  toolData: Tool | undefined;

  cliTools: CliTool[] = CLI_TOOLS;
  selectedTool: CliTool | null = null;
  selectedSubcommand: Subcommand | null = null;
  optionValues: Map<string, OptionValue> = new Map();

  generatedCommand = '';
  copied = false;
  copiedTimeout: any = null;

  // Step tracking
  get currentStep(): number {
    if (!this.selectedTool) return 1;
    if (!this.selectedSubcommand) return 2;
    return 3;
  }

  constructor(private dataService: DataService) {
    this.toolData = this.dataService.getToolDataById(this.toolId);
  }

  ngOnInit(): void {}

  selectTool(tool: CliTool): void {
    if (this.selectedTool?.id === tool.id) return;
    this.selectedTool = tool;
    this.selectedSubcommand = null;
    this.optionValues.clear();
    this.generatedCommand = '';
  }

  selectSubcommand(subcommand: Subcommand): void {
    this.selectedSubcommand = subcommand;
    this.initializeOptions(subcommand);
    this.buildCommand();
  }

  private initializeOptions(subcommand: Subcommand): void {
    this.optionValues.clear();
    for (const option of subcommand.options) {
      this.optionValues.set(option.flag, {
        enabled: option.required || false,
        value: option.defaultValue || '',
        repeatableValues: option.type === 'repeatable' ? [] : []
      });
    }
  }

  toggleOption(option: CommandOption): void {
    const current = this.optionValues.get(option.flag);
    if (current) {
      current.enabled = !current.enabled;
      if (!current.enabled) {
        current.value = option.defaultValue || '';
        current.repeatableValues = [];
      }
    }
    this.buildCommand();
  }

  updateOptionValue(option: CommandOption, value: string): void {
    const current = this.optionValues.get(option.flag);
    if (current) {
      current.value = value;
      if (value.trim()) {
        current.enabled = true;
      }
    }
    this.buildCommand();
  }

  addRepeatableValue(option: CommandOption): void {
    const current = this.optionValues.get(option.flag);
    if (current) {
      current.repeatableValues.push('');
      current.enabled = true;
    }
    this.buildCommand();
  }

  updateRepeatableValue(option: CommandOption, index: number, value: string): void {
    const current = this.optionValues.get(option.flag);
    if (current && current.repeatableValues) {
      current.repeatableValues[index] = value;
    }
    this.buildCommand();
  }

  removeRepeatableValue(option: CommandOption, index: number): void {
    const current = this.optionValues.get(option.flag);
    if (current && current.repeatableValues) {
      current.repeatableValues.splice(index, 1);
      if (current.repeatableValues.length === 0) {
        current.enabled = false;
      }
    }
    this.buildCommand();
  }

  buildCommand(): void {
    if (!this.selectedTool || !this.selectedSubcommand) {
      this.generatedCommand = '';
      return;
    }

    const parts: string[] = [this.selectedTool.id];

    // Handle special composite subcommands (e.g. "compose up", "pip install")
    const subParts = this.selectedSubcommand.name.split(' ');
    parts.push(...subParts);

    // Build flags and options
    for (const option of this.selectedSubcommand.options) {
      const optVal = this.optionValues.get(option.flag);
      if (!optVal || !optVal.enabled) continue;

      switch (option.type) {
        case 'toggle':
          parts.push(option.shortFlag || option.flag);
          break;

        case 'text':
          if (optVal.value.trim()) {
            // Some flags use = syntax, others use space
            const flagStr = option.shortFlag as string;
            parts.push(flagStr);
            // Wrap value in quotes if it contains spaces
            const val = optVal.value.trim();
            parts.push(val.includes(' ') ? `"${val}"` : val);
          }
          break;

        case 'select':
          if (optVal.value.trim()) {
            const flagStr = option.shortFlag as string;
            parts.push(flagStr);
            parts.push(optVal.value.trim());
          }
          break;

        case 'repeatable':
          for (const repVal of optVal.repeatableValues) {
            if (repVal.trim()) {
              const flagStr = option.shortFlag || option.flag;
              parts.push(flagStr);
              parts.push(repVal.trim());
            }
          }
          break;
      }
    }

    this.generatedCommand = parts.join(' ');
  }

  async copyToClipboard(): Promise<void> {
    if (!this.generatedCommand) return;

    try {
      await navigator.clipboard.writeText(this.generatedCommand);
      this.showCopiedFeedback();
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = this.generatedCommand;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.showCopiedFeedback();
    }
  }

  private showCopiedFeedback(): void {
    this.copied = true;
    if (this.copiedTimeout) {
      clearTimeout(this.copiedTimeout);
    }
    this.copiedTimeout = setTimeout(() => {
      this.copied = false;
    }, 2000);
  }

  resetAll(): void {
    this.selectedTool = null;
    this.selectedSubcommand = null;
    this.optionValues.clear();
    this.generatedCommand = '';
    this.copied = false;
  }

  resetFromStep(step: number): void {
    if (step <= 1) {
      this.resetAll();
    } else if (step <= 2) {
      this.selectedSubcommand = null;
      this.optionValues.clear();
      this.generatedCommand = '';
    }
  }

  getOptionGroups(options: CommandOption[]): { group: string; options: CommandOption[] }[] {
    const groupMap = new Map<string, CommandOption[]>();
    for (const opt of options) {
      const group = opt.group || 'Options';
      if (!groupMap.has(group)) {
        groupMap.set(group, []);
      }
      groupMap.get(group)!.push(opt);
    }
    return Array.from(groupMap.entries()).map(([group, opts]) => ({ group, options: opts }));
  }

  getOptionValue(flag: string): OptionValue {
    return this.optionValues.get(flag) || { enabled: false, value: '', repeatableValues: [] };
  }

  // Command syntax highlighting segments
  getCommandSegments(): { text: string; type: 'tool' | 'subcommand' | 'flag' | 'value' | 'space' }[] {
    if (!this.generatedCommand) return [];

    const segments: { text: string; type: 'tool' | 'subcommand' | 'flag' | 'value' | 'space' }[] = [];
    const parts = this.generatedCommand.match(/(?:[^\s"]+|"[^"]*")+/g) || [];

    parts.forEach((part, index) => {
      if (index > 0) {
        segments.push({ text: ' ', type: 'space' });
      }

      if (index === 0) {
        segments.push({ text: part, type: 'tool' });
      } else if (index <= (this.selectedSubcommand?.name.split(' ').length || 1)) {
        segments.push({ text: part, type: 'subcommand' });
      } else if (part.startsWith('-')) {
        segments.push({ text: part, type: 'flag' });
      } else {
        segments.push({ text: part, type: 'value' });
      }
    });

    return segments;
  }

  // Track the count of active options
  get activeOptionsCount(): number {
    let count = 0;
    for (const [, val] of this.optionValues) {
      if (val.enabled) count++;
    }
    return count;
  }
}
