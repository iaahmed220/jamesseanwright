(function () {
    'use strict';

    const context = new AudioContext();
    const recordButton = document.querySelector('.record');

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(onStreamReady);

    function onStreamReady(mediaStream) {
        recordButton.onclick = () => {
            record(mediaStream)
                .then(data => new Blob(data))
                .then(convertToArrayBuffer)
                .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
                .then(play);
        }
    }

    function record(mediaStream) {
        return new Promise(resolve => {
            const mediaRecorder = new MediaRecorder(mediaStream);
            const data = [];

            mediaRecorder.ondataavailable = e => e.data.size && data.push(e.data);
            mediaRecorder.start();
            mediaRecorder.onstop = () => resolve(data);

            recordButton.textContent = 'Stop';
            recordButton.onclick = () => mediaRecorder.stop();
        });        
    }

    function convertToArrayBuffer(blob) {
        const url = URL.createObjectURL(blob);

        return fetch(url)
            .then(response => response.arrayBuffer());
    }

    function play(audioBuffer) {
        console.log(audioBuffer);
    }
}());