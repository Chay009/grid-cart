import { useState, useCallback, useEffect } from 'react';

import { useQueue } from "@uidotdev/usehooks";
import { useNowPlaying } from "react-nowplaying";

function useAudioManager() {
  // Single state to track whether the bot is speaking (audio is playing)
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const audioQueue = useQueue([]);
  const { player, stop: stopAudio, play: playAudio } = useNowPlaying();

  const onSpeechStart = useCallback(() => {
    setIsBotSpeaking(false); // Bot stops speaking when the user starts speaking
    console.log('user speaking');
    if (player && !player.paused) {
      stopAudio();
      console.log("Speech detected, audio paused");
    }
  }, [player, stopAudio]);

  const onSpeechEnd = useCallback(() => {
    if (audioQueue.size > 0) {
      const nextAudio = audioQueue.remove();
      playNextAudio(nextAudio);
    }
  }, [audioQueue]);



  const playNextAudio = useCallback(async (audioData) => {
    console.log(audioData);
    const { blob, mimeType, onPlayComplete } = audioData;
    try {
      setIsBotSpeaking(true); // Bot starts speaking when audio is played
      await playAudio(blob, mimeType);
      if (onPlayComplete) onPlayComplete();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  }, [playAudio]);

  const addToQueue = useCallback((audioData) => {
    if (player && !player.paused) {
      stopAudio();
      audioQueue.clear();
      playNextAudio(audioData);
    } else {
      playNextAudio(audioData);
    }
  }, [player, audioQueue, playNextAudio, stopAudio]);

  // Effect to track when the audio has ended
  useEffect(() => {
    const handleAudioEnd = () => {
      setIsBotSpeaking(false); // Bot stops speaking when the audio ends
      console.log("Audio has ended");
      if (audioQueue.size > 0) {
        const nextAudio = audioQueue.remove();
        playNextAudio(nextAudio);
      }
    };

    if (player) {
      player.addEventListener('ended', handleAudioEnd);
    }

    return () => {
      if (player) {
        player.removeEventListener('ended', handleAudioEnd);
      }
    };
  }, [player, audioQueue, playNextAudio]);

  return {
    isBotSpeaking, // Expose this state to show whether the bot is speaking
    player,
    stopAudio,
    QueueToPlayAudio: addToQueue,
  };
}

export default useAudioManager;
