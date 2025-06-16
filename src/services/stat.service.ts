import { Injectable } from '@angular/core';
import {StatData, StatTool} from "../model/stats";

@Injectable({
  providedIn: 'root'
})
export class StatService {
  LOCAL_STORAGE_KEY = "STATS";

  stats?: StatData;
  hasStats = false;

  constructor() {
    this.loadStats();
  }

  clearStats() {
    this.stats = undefined;
    this.hasStats = false;
    localStorage.removeItem(this.LOCAL_STORAGE_KEY);
  }

  loadStats() {
    let data = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    if (!data) {
      return;
    }
    this.stats = JSON.parse(data);
    this.hasStats = true;
  }

  saveStats(tool: StatTool, data: object) {
    console.log(`Saving stats for tool ${tool}`);
    this.stats = {
      selectedTool: tool,
      data: data
    };
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(this.stats));
    this.hasStats = true;
  }
}
