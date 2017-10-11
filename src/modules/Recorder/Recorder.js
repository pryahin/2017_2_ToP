import {mergeBuffers, interleave, encodeWAV} from '../WavConverter/WavConverter';

export default class Recorder {
    constructor() {
        this.recLength = 0;
        this.recBuffersL = [];
        this.recBuffersR = [];

        this.recording = false;

        this.bufferLen = 4096;
    }

    init(source) {
        this.context = source.context;
        this.sampleRate = this.context.sampleRate;

        if (!this.context.createScriptProcessor) {
            this.node = this.context.createJavaScriptNode(this.bufferLen, 2, 2);
        } else {
            this.node = this.context.createScriptProcessor(this.bufferLen, 2, 2);
        }

        this.node.onaudioprocess = e => {
            if (!this.recording) return;

            let buffers = [];
            for (let i = 0; i < 2; i++) {
                buffers[i] = new Float32Array(this.bufferLen);
                e.inputBuffer.copyFromChannel(buffers[i], i);
            }

            this.recBuffersL.push(buffers[0]);
            this.recBuffersR.push(buffers[1]);
            this.recLength += buffers[0].length;
        };

        source.connect(this.node);
        this.node.connect(this.context.destination);
    }

    record() {
        this.recording = true;
    }

    stop() {
        this.recording = false;
    }

    clear() {
        this.recLength = 0;
        this.recBuffersL = [];
        this.recBuffersR = [];
    }

    exportWAV(callback) {
        const type = 'audio/wav';
        const bufferL = mergeBuffers(this.recBuffersL, this.recLength);
        const bufferR = mergeBuffers(this.recBuffersR, this.recLength);

        const interleaved = interleave(bufferL, bufferR);
        const dataview = encodeWAV(interleaved, null, this.sampleRate);
        const audioBlob = new Blob([dataview], {'type': type});

        callback(audioBlob);
    }
}

Recorder.setupDownload = blob => {
    const url = (window.URL || window.webkitURL).createObjectURL(blob);
    const link = document.querySelector('#save');
    const audio = document.querySelector('audio');
    audio.src = url;
    link.href = url;
    link.download = 'output.wav';
};