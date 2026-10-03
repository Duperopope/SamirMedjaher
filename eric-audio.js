/** Procédural room tone for Éric's refuge. No external audio assets. */
class EricAudio {
    constructor() {
        this.context = null;
        this.master = null;
        this.ambientBus = null;
        this.noiseBuffer = null;
        this.nodes = [];
        this.chimeTimer = null;
        this.stepTimer = null;
        this.room = 'living';
        this.enabled = localStorage.getItem('ericAudioEnabled') === 'true';
        this.volume = Number(localStorage.getItem('ericAudioVolume') || .72);
    }

    ensureContext() {
        if (this.context) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        this.context = new AudioContext();

        this.master = this.context.createGain();
        this.master.gain.value = .18 * this.volume;
        this.master.connect(this.context.destination);

        this.ambientBus = this.context.createGain();
        this.ambientBus.gain.value = 1;
        this.ambientBus.connect(this.master);

        const length = this.context.sampleRate * 2;
        this.noiseBuffer = this.context.createBuffer(1, length, this.context.sampleRate);
        const data = this.noiseBuffer.getChannelData(0);
        let previous = 0;
        for (let i = 0; i < length; i += 1) {
            const white = Math.random() * 2 - 1;
            previous = previous * .985 + white * .015;
            data[i] = previous * 3.2;
        }
    }

    async toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('ericAudioEnabled', String(this.enabled));
        if (this.enabled) {
            await this.startAmbient();
            this.playRoomMotif(.08);
        } else {
            this.stopAmbient();
        }
        return this.enabled;
    }

    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, Number(value)));
        localStorage.setItem('ericAudioVolume', String(this.volume));
        if (this.master && this.context) {
            this.master.gain.setTargetAtTime(.18 * this.volume, this.context.currentTime, .05);
        }
    }

    setRoom(room) {
        this.room = room || 'living';
        if (!this.enabled || !this.context) return;
        this.applyRoomProfile();
        clearTimeout(this.chimeTimer);
        this.scheduleChime();
    }

    async startAmbient() {
        this.ensureContext();
        if (!this.context) return;
        await this.context.resume();
        if (this.nodes.length) {
            this.applyRoomProfile();
            return;
        }

        const now = this.context.currentTime;

        const drone = this.context.createOscillator();
        const droneGain = this.context.createGain();
        const droneFilter = this.context.createBiquadFilter();
        drone.type = 'sine';
        drone.frequency.value = 55;
        droneFilter.type = 'lowpass';
        droneFilter.frequency.value = 180;
        droneGain.gain.value = .075;
        drone.connect(droneFilter).connect(droneGain).connect(this.ambientBus);
        drone.start(now);

        const harmonic = this.context.createOscillator();
        const harmonicGain = this.context.createGain();
        harmonic.type = 'triangle';
        harmonic.frequency.value = 110;
        harmonic.detune.value = -5;
        harmonicGain.gain.value = .025;
        harmonic.connect(harmonicGain).connect(this.ambientBus);
        harmonic.start(now);

        const air = this.context.createBufferSource();
        const airFilter = this.context.createBiquadFilter();
        const airGain = this.context.createGain();
        air.buffer = this.noiseBuffer;
        air.loop = true;
        airFilter.type = 'bandpass';
        airFilter.frequency.value = 310;
        airFilter.Q.value = .5;
        airGain.gain.value = .13;
        air.connect(airFilter).connect(airGain).connect(this.ambientBus);
        air.start(now);

        const city = this.context.createBufferSource();
        const cityFilter = this.context.createBiquadFilter();
        const cityGain = this.context.createGain();
        city.buffer = this.noiseBuffer;
        city.loop = true;
        cityFilter.type = 'highpass';
        cityFilter.frequency.value = 1800;
        cityGain.gain.value = .018;
        city.connect(cityFilter).connect(cityGain).connect(this.ambientBus);
        city.start(now);

        this.nodes = [drone, droneGain, droneFilter, harmonic, harmonicGain, air, airFilter, airGain, city, cityFilter, cityGain];
        this.profileNodes = { drone, droneGain, droneFilter, harmonic, harmonicGain, airFilter, airGain, cityFilter, cityGain };
        this.applyRoomProfile();
        this.scheduleChime();
    }

    applyRoomProfile() {
        if (!this.context || !this.profileNodes) return;
        const p = {
            living:  { drone:55, harmonic:110, air:310, airGain:.13, city:.018 },
            kitchen: { drone:60, harmonic:120, air:430, airGain:.10, city:.014 },
            bedroom: { drone:49, harmonic:98,  air:220, airGain:.075, city:.010 },
            garden:  { drone:46, harmonic:92,  air:620, airGain:.16, city:.028 }
        }[this.room] || { drone:55, harmonic:110, air:310, airGain:.13, city:.018 };
        const t = this.context.currentTime;
        this.profileNodes.drone.frequency.setTargetAtTime(p.drone, t, .6);
        this.profileNodes.harmonic.frequency.setTargetAtTime(p.harmonic, t, .6);
        this.profileNodes.airFilter.frequency.setTargetAtTime(p.air, t, .6);
        this.profileNodes.airGain.gain.setTargetAtTime(p.airGain, t, .6);
        this.profileNodes.cityGain.gain.setTargetAtTime(p.city, t, .6);
    }

    stopAmbient() {
        clearTimeout(this.chimeTimer);
        this.stopSteps();
        this.nodes.forEach(node => {
            try { node.stop?.(); } catch (_) {}
            try { node.disconnect?.(); } catch (_) {}
        });
        this.nodes = [];
        this.profileNodes = null;
    }

    scheduleChime() {
        clearTimeout(this.chimeTimer);
        if (!this.enabled) return;
        const delay = 6500 + Math.random() * 7000;
        this.chimeTimer = setTimeout(() => {
            this.playRoomMotif(.035);
            this.scheduleChime();
        }, delay);
    }

    playRoomMotif(volume = .045) {
        const motifs = {
            living:  [220, 329.63, 440],
            kitchen: [196, 293.66, 392],
            bedroom: [174.61, 220, 261.63],
            garden:  [246.94, 369.99, 493.88]
        };
        const notes = motifs[this.room] || motifs.living;
        notes.forEach((note, index) => {
            setTimeout(() => this.playTone(note, .42, volume * (index === 2 ? .8 : 1)), index * 180);
        });
    }

    playTone(frequency = 440, duration = .7, volume = .06) {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.context) return;
        const now = this.context.currentTime;
        const oscillator = this.context.createOscillator();
        const gain = this.context.createGain();
        const filter = this.context.createBiquadFilter();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        filter.type = 'lowpass';
        filter.frequency.value = 1800;
        gain.gain.setValueAtTime(.0001, now);
        gain.gain.exponentialRampToValueAtTime(Math.max(.001, volume), now + .025);
        gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
        oscillator.connect(filter).connect(gain).connect(this.master);
        oscillator.start(now);
        oscillator.stop(now + duration + .05);
    }

    playStep() {
        if (!this.enabled || !this.context) return;
        const now = this.context.currentTime;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(88 + Math.random() * 14, now);
        osc.frequency.exponentialRampToValueAtTime(54, now + .07);
        gain.gain.setValueAtTime(.035, now);
        gain.gain.exponentialRampToValueAtTime(.0001, now + .09);
        osc.connect(gain).connect(this.master);
        osc.start(now);
        osc.stop(now + .1);
    }

    startSteps() {
        if (!this.enabled || this.stepTimer) return;
        this.ensureContext();
        this.playStep();
        this.stepTimer = setInterval(() => this.playStep(), 315);
    }

    stopSteps() {
        clearInterval(this.stepTimer);
        this.stepTimer = null;
    }
}

window.EricAudio = EricAudio;
window.ericAudio = window.ericAudio || new EricAudio();
