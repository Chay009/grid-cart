"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Siriwave from "react-siriwave";
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import { useParams } from "react-router-dom";
import { AudioLines, Check, Mic, MicOff, Phone, PhoneOff, Search, X } from "lucide-react";
import useAudioManager from "../hooks/useAudioManager";
import { useQueue } from "@uidotdev/usehooks";
import useMicrophoneToggle from "../hooks/useMicrophoneToggle";
import { toast } from "react-hot-toast";
const DEFAULT_STT_MODEL = 'nova-2';
const defaultSttsOptions = {
  model: DEFAULT_STT_MODEL,
  interim_results: true,
  endpointing: 900,
  utterance_end_ms: 2300,
  filler_words: true,
  smart_format: true,
  numerals: true,
  measurements: true,
  punctuate: true,
  language: "en-US",
};

export const Call = () => {
  const { sellerId, sellername } = useParams();
  const userId = localStorage.getItem("userId");


  const [deepgramApiKey, setDeepgramApiKey] = useState(null);
  const [connection, setConnection] = useState(null);
  const [isListening, setListening] = useState(false);
  const [isProcessing, setProcessing] = useState(false);
  
 
  const [userMedia, setUserMedia] = useState(null);
  const [caption, setCaption] = useState("");
 
  const [isBotThinking, setIsBotThinking] = useState(false);
  let setIsBotSpeaking

  const { QueueToPlayAudio,isBotSpeaking} = useAudioManager();
// the diff between bot listening and listening not figure out yet
const {
microphoneToggle,queueSize,removeBlob,firstBlob,microphoneOpen
} = useMicrophoneToggle();

  useEffect(() => {
    if (!deepgramApiKey) {
      axios.get("http://localhost:2424/auth/deepgram")
        .then((response) => {
          if (response.data.api_key) {
            setDeepgramApiKey(response.data.api_key);
          } else {
            throw new Error("No API key returned");
          }
        })
        .catch((error) => console.error(error));
    }
  }, [deepgramApiKey]);

  let keepAlive
  useEffect(() => {
    if (deepgramApiKey) {
      try {
        const deepgram = createClient(deepgramApiKey);
        const deepgram_connection = deepgram.listen.live(defaultSttsOptions);
        
  
        if (keepAlive) clearInterval(keepAlive);
        keepAlive = setInterval(() => {
          console.log("KeepAlive sent.");
          deepgram_connection.keepAlive();
        }, 8000); // Sending KeepAlive messages every 3 seconds
        deepgram_connection.on(LiveTranscriptionEvents.Open, () => {
toast.success("Connection established, bot listening")
          console.log("Connection established, bot listening");
          setListening(true);
        });
  
        deepgram_connection.on(LiveTranscriptionEvents.Close, () => {
          console.log("Connection closed"); 
          toast.error("Call Ended")// means call ended and that conversation is lost once discnnected
          setListening(false);
          // setConnection(null);
        });
  
        deepgram_connection.on(LiveTranscriptionEvents.Transcript, (data) => {
          const words = data.channel.alternatives[0].words;
          const caption = words.map((word) => word.punctuated_word ?? word.word).join(" ");
  
          if (caption !== "") {
            setCaption(caption);
  
            if (data.is_final) {
              // User finished speaking; send to server and set "thinking" state
              setIsBotThinking(true);
              
             
             let serverResponse=
              axios.post(`http://localhost:8000/brain/${userId}/${sellername}/${sellerId}`, { 
                messages: [{ role: "user", content: caption }] 
              })
              .then((response) => {
                 serverResponse = response.data.llm_response;
               
                setIsBotThinking(false); // Stop thinking before playing audio
                
  
                return axios.post(
                  "http://localhost:2424/stream/voice",
                  {
                    text: serverResponse || "",
                    params: { model: "aura-perseus-en" },
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                      "X-API-Key": deepgramApiKey,
                    },
                    responseType: "arraybuffer",
                  }
                );

               
              })
              .then(async (response) => {
                
                const audioBlob = new Blob([response.data], { type: "audio/mp3" });
                QueueToPlayAudio({
                  blob: audioBlob,
                  mimeType: "audio/mp3",
                  onPlayComplete: () => {
                    setCaption(serverResponse || "");
                    console.log("Waiting for input...");
                    console.log("Audio complete");
                  },
                });
              })
              .catch((error) => {
                console.error("Error in processing message or playing response audio:", error);
                setIsBotThinking(false); // Reset thinking state on error
              });
            }
          }
        });
  
        setConnection(deepgram_connection);
  
      
      } catch (error) {
        console.error("Error creating Deepgram client:", error);
      }
    }
  }, [deepgramApiKey]);
  
  


  // once the connection is set to deepgram connection we can use connection 
  useEffect(() => {
    const processQueue = async () => {
      if (queueSize > 0 && !isProcessing) {
        setProcessing(true);
        if (isListening) {
          const blob = firstBlob;
          connection?.send(blob);
          removeBlob();
        }
        const timeout = setTimeout(() => {
          setProcessing(false);
          clearTimeout(timeout);
        }, 250);
      }
    };
    processQueue();
  }, [queueSize, firstBlob,  removeBlob, connection, isListening, isProcessing]);




  return (
    <div className="w-screen h-screen bg-gray-900 text-white overflow-hidden flex flex-col">
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-2">
        {/* Add any additional status bar elements here */}
      </div>
  
      {/* Main content */}
      <div className="flex flex-col items-center justify-center  px-6">
        {true && (
          <div className="flex gap-2 items-center justify-center bg-orange-600/80 text-white text-xs font-semibold py-1 px-3 rounded-full mb-4">
            Voice Recognition
            <AudioLines className="animate-pulse" />
          </div>
        )}
        {true && (
          <div className="flex gap-2 items-center justify-center bg-orange-600/80 text-white text-xs font-semibold py-1 px-3 rounded-full mb-4">
            <span className="text-sm">{isListening ? "Connected" : "Connecting..."}</span>
            <div className={`w-4 h-4 rounded-full animate-pulse ${isListening ? "bg-green-400" : "bg-gray-400"}`}></div>
          </div>
        )}
        
        <div className=" w-14 h-14 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
              {sellername[0].toUpperCase()}
            </div>
        <h1 className="text-3xl font-bold mb-4 text-center">
          Say anything to<br />Mr. {sellername.split('@')[0]} AI!
        </h1>
        
        {/* Siriwave with glowing effect */}
        <div className="relative w-full h-36 mb-4 flex items-center justify-center">
          {/* Outer container for glow effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Glowing effect layers */}
            <div className="absolute inset-0 bg-yellow-500/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute inset-0 bg-cyan-400/10 rounded-full blur-[80px] animate-pulse delay-75"></div>
            <div className="absolute inset-0 bg-sky-300/10 rounded-full blur-[50px] animate-pulse delay-150"></div>
            <div className="absolute inset-0 bg-teal-400/10 rounded-full blur-[30px] animate-pulse delay-300"></div>
          </div>


          
  
          {/* Inner container for Siriwave */}
          <div className="relative  z-10">


            <Siriwave
              theme="ios9"
              amplitude={isBotSpeaking ? 5 : 0.5}
              speed={isBotSpeaking ? 0.2 : 0.1}
              autostart={isBotSpeaking}
            />
          </div>
        </div>
              {/* Status Badges */}
<div className="text-center mb-4 ">
  { microphoneOpen && !isBotSpeaking&&!isBotThinking&&(
    <div className="relative flex justify-center  ">
      {/* Listening Badge */}
      <div className="bg-green-500 text-white text-sm px-4 py-2 rounded-full transform transition-transform duration-500 ease-in-out animate-pulse">
        Listening...
      </div>
    </div>
  )}

  {isBotThinking && (
   <div className="relative flex justify-center  ">
   {/* Listening Badge */}
   <div className="bg-yellow-500 text-white text-sm px-4 py-2 rounded-full transform transition-transform duration-500 ease-in-out animate-bounce">
     bot thinking..
   </div>
 </div>
  )}

 
</div>


        {/* Caption */}
        <h1 className="bg-red-900 text-center w-full p-4">
          {caption}
        </h1>
      </div>
  
      {/* Bottom action buttons */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
        {/* Microphone Button */}
        <button 
          className={`flex items-center justify-center w-16 h-16 rounded-full transition-transform duration-300 shadow-lg transform ${microphoneOpen ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'} hover:scale-105`} 
          onClick={microphoneToggle}
          
        >
          {microphoneOpen ? <Mic size={32} /> : <MicOff size={32} />}
        </button>
  
        {/* End Call Button */}
        <button 
          className="flex items-center justify-center w-16 h-16 bg-red-500 hover:bg-red-600 transition-colors duration-300 rounded-full shadow-lg hover:scale-105" 
          onClick={() => console.log("End call")}
        >
          <Phone size={32} />
        </button>
  
      </div>
    </div>
  );
  
  
   };
