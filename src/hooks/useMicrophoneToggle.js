import { useState, useCallback, useRef, useEffect } from 'react';
import { useQueue } from '@uidotdev/usehooks';

function useMicrophoneToggle() {
    const [microphone, setMicrophone] = useState(null); // Explicitly setting initial state to null
    const [stream, setStream] = useState(null);
    const [microphoneOpen, setMicrophoneOpen] = useState(false);
    const {
        add: enqueueBlob,
        remove: removeBlob,
        first: firstBlob,
        size: queueSize,
        queue,
    } = useQueue([]);

    useEffect(() => {
        async function setupMicrophone() {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        noiseSuppression: true,
                        echoCancellation: true,
                    },
                });

                setStream(mediaStream);
                const mic = new MediaRecorder(mediaStream);
                setMicrophone(mic);
            } catch (error) {
                console.error("Error accessing microphone:", error);
            }
        }

        if (!microphone) {
            setupMicrophone();
        }
    }, [microphone]);

    useEffect(() => {
        if (!microphone) return;

        microphone.ondataavailable = (e) => {
            if (microphoneOpen) enqueueBlob(e.data);
        };

        return () => {
            microphone.ondataavailable = null;
        };
    }, [enqueueBlob, microphone, microphoneOpen]);

    const stopMicrophone = useCallback(() => {
        if (microphone?.state === "recording") microphone.pause();
        setMicrophoneOpen(false);
    }, [microphone]);

    const startMicrophone = useCallback(() => {
        if (microphone?.state === "paused") {
            microphone.resume();
        } else {
            microphone.start(250);
        }
        setMicrophoneOpen(true);
    }, [microphone]);

    useEffect(() => {
       
        const handleVisibilityChange = () => {
            if (document.visibilityState !== "visible") stopMicrophone();
        };

        window.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.removeEventListener("visibilitychange", handleVisibilityChange);
            // Stop the microphone and media stream when the component unmounts
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stopMicrophone, stream]);

    const microphoneToggle = useCallback(
        async (e) => {
            e.preventDefault();
            if (microphoneOpen) {
                stopMicrophone();
            } else {
                startMicrophone();
            }
        },
        [microphoneOpen, startMicrophone, stopMicrophone]
    );

    return { microphoneToggle, queueSize, removeBlob, firstBlob, microphoneOpen };
}

export default useMicrophoneToggle;
