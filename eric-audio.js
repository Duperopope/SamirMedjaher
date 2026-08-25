/** Bande-son procédurale originale des Aventures d'Éric. Aucun asset externe. */
class EricAudio {
    constructor() {
        this.context = null;
        this.master = null;
        this.ambientNodes = [];
        this.chimeTimer = null;
        this.stepTimer = null;
        this.enabled = localStorage.getItem('ericAudioEnabled') === 'true';
    }

    ensureContext() {
        if (this.context) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        this.context = new AudioContext();
        this.master = this.context.createGain();
        this.master.gain.value = .11;
        this.master.connect(this.context.destination);
    }

    async toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('ericAudioEnabled', String(this.enabled));
        if (this.enabled) await this.startAmbient();
        else this.stopAmbient();
        return this.enabled;
    }

    async startAmbient() {
        this.ensureContext();
        if (!this.context || this.ambientNodes.length) return;
        await this.context.resume();
        const now = this.context.currentTime;
        [110, 164.81, 220].forEach((frequency, index) => {
            const oscillator = this.context.createOscillator();
            const gain = this.context.createGain();
            const filter = this.context.createBiquadFilter();
            oscillator.type = index === 1 ? 'sine' : 'triangle';
            oscillator.frequency.value = frequency;
            oscillator.detune.value = index * 3 - 3;
            filter.type = 'lowpass';
            filter.frequency.value = 520;
            gain.gain.value = index === 1 ? .028 : .018;
            oscillator.connect(filter).connect(gain).connect(this.master);
            oscillator.start(now);
            this.ambientNodes.push(oscillator, gain, filter);
        });
        this.scheduleChime();
    }

    stopAmbient() {
        clearTimeout(this.chimeTimer);
        this.stopSteps();
        this.ambientNodes.forEach(node => { try { node.stop?.(); } catch (_) {} node.disconnect?.(); });
        this.ambientNodes = [];
    }

    scheduleChime() {
        clearTimeout(this.chimeTimer);
        if (!this.enabled) return;
        this.chimeTimer = setTimeout(() => {
            this.playTone([329.63, 440, 493.88][Math.floor(Math.random() * 3)], 2.8, .035);
            this.scheduleChime();
        }, 6500 + Math.random() * 9000);
    }

    playTone(frequency = 440, duration = .7, volume = .06) {
        if (!this.enabled) return;
        this.ensureContext();
        const now = this.context.currentTime;
        const oscillator = this.context.createOscillator();
        const gain = this.context.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(.0001, now);
        gain.gain.exponentialRampToValueAtTime(volume, now + .04);
        gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
        oscillator.connect(gain).connect(this.master);
        oscillator.start(now);
        oscillator.stop(now + duration + .05);
    }

    startSteps() {
        if (!this.enabled || this.stepTimer) return;
        this.stepTimer = setInterval(() => this.playTone(95 + Math.random() * 18, .07, .025), 235);
    }

    stopSteps() {
        clearInterval(this.stepTimer);
        this.stepTimer = null;
    }
}

window.EricAudio = EricAudio;
window.ericAudio = window.ericAudio || new EricAudio();
