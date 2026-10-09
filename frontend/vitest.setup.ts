import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})

// Mock Web Speech API for JSDOM
class MockSpeechSynthesisUtterance {
  text: string;
  rate: number;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  constructor(text: string) {
    this.text = text;
    this.rate = 1;
    this.onend = null;
    this.onerror = null;
  }
}
Object.defineProperty(window, 'SpeechSynthesisUtterance', {
  value: MockSpeechSynthesisUtterance,
  writable: true
});
