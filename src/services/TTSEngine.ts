export type ModuleType = 'alphabet' | 'vowel' | 'sentence';

interface TTSOptions {
  rate?: number;
  pitch?: number;
  lang?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

// Dictionary untuk mengakali ejaan/pengucapan yang salah dari TTS bawaan browser
// Biasanya engine yang mendeteksi bahasa inggris akan salah membaca suku kata (misal 'to' dibaca 'tu')
const phoneticsDict: Record<string, string> = {
  'ca': 'tja',
  'ce': 'ceh',
  'co': 'coh',
  'to': 'toh',
  'do': 'doh',
  'go': 'goh',
  'ho': 'hoh',
  'no': 'noh',
  'ro': 'roh',
  'so': 'soh',
  'yo': 'yoh',
  'be': 'beh',
  'me': 'meh',
  'he': 'heh',
  'we': 'weh',
  'ge': 'geh',
  'pe': 'peh',
  'ze': 'zeh',
};

export class TTSEngine {
  static cleanTextForTTS(text: string): string {
    let cleanText = text.toLowerCase();
    // Terapkan phonetic replacements
    for (const [key, value] of Object.entries(phoneticsDict)) {
      // Regex untuk mereplace kata/huruf yang spesifik
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      cleanText = cleanText.replace(regex, value);
    }
    return text; // Return text asli sementara, karena engine default Indo biasanya sudah benar. Jika ada edge case, replace di phoneticsDict.
  }

  static speak(text: string, options?: TTSOptions): Promise<void> {
    return new Promise((resolve) => {
      if (!window.speechSynthesis) {
        resolve();
        return;
      }

      // Cancel ongoing speeches
      window.speechSynthesis.cancel();

      const textToSpeak = this.cleanTextForTTS(text);
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      utterance.lang = options?.lang || 'id-ID';
      utterance.rate = options?.rate || 0.9; // Sedikit dilambatkan karena untuk anak-anak
      utterance.pitch = options?.pitch || 1.1;

      utterance.onstart = () => {
        if (options?.onStart) options.onStart();
      };

      utterance.onend = () => {
        if (options?.onEnd) options.onEnd();
        resolve();
      };

      utterance.onerror = (e) => {
        console.error('TTS Error:', e);
        // Continue flow even if TTS fails (e.g. user interacted to cancel it)
        resolve(); 
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  static stop() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  // --- TTS Prompts Generators ---

  static getQuestionInstruction(module: ModuleType, target: string): string {
    switch (module) {
      case 'alphabet':
        return `Cari huruf, ${target}`;
      case 'vowel':
        return `Susun kata, ${target}`;
      case 'sentence':
        return `Susun kalimat, ${target}`;
      default:
        return target;
    }
  }

  static getFeedback(isCorrect: boolean, correctAnswer: string, playerName: string, isMilestone: boolean, isLastQuestion: boolean = false): string {
    const nameStr = playerName && playerName.trim() !== '' ? playerName : 'Teman';
    
    let baseFeedback = '';
    if (isCorrect) {
      if (isMilestone) baseFeedback = `Hebat! ${nameStr} sangat pintar!`;
      else baseFeedback = 'Benar! Ayo kita lanjut.';
    } else {
      if (isMilestone) baseFeedback = `Ayo fokus! ${nameStr} pasti bisa.`;
      else baseFeedback = `Salah. Yang benar adalah, ${correctAnswer}.`;
    }

    if (isLastQuestion) {
      return `${baseFeedback} Soal selesai, ayo lihat nilainya.`;
    }
    
    return baseFeedback;
  }

  static getSummary(score: number, playerName: string): string {
    const nameStr = playerName && playerName.trim() !== '' ? playerName : 'Teman';

    if (score === 100) {
      return `${nameStr} sangat luar biasa! Nilaimu ${score}, sangat sempurna!`;
    } else if (score >= 50) {
      return `Terus semangat! ${nameStr} mendapat nilai ${score}.`;
    } else {
      return `Nilaimu ${score}. Ayo terus belajar ya, ${nameStr}.`;
    }
  }
}
