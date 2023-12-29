import { ErrorTexts } from '@/stores/texts/models/ErrorTexts';
import { defineStore } from 'pinia';

export const useTextStore = defineStore('texts', {  
  actions: {
    getErrorText(error: string) {
      return ErrorTexts[error] || ErrorTexts.default;
    }
  }
});
