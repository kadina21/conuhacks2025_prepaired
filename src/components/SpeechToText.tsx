import useSpeechRecognition from "@/hooks/use-speech-recognition";

const SpeechToText = () => {
  const {
    text,
    startListening,
    stopListening,
    isListening,
    hasRecognitionSupport,
  } = useSpeechRecognition();

  return (
    <div>
      {hasRecognitionSupport ? (
        <>
          <div>
            <button onClick={startListening}>Start Listening</button>
            <button onClick={stopListening}>Stop Listening</button>
          </div>
          {isListening ? <div>Your browser is currently listening</div> : null}
          {text}
        </>
      ) : null}
    </div>
  );
};

export default SpeechToText;
