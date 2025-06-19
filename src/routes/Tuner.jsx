import React, { useEffect, useRef, useState } from 'react'
import { PitchDetector } from 'pitchy';

function Tuner() {
  const [note, setNote] = useState(null);
  const [octave, setOctave] = useState(null)
  const [centsoff, setCentsoff] = useState(null)
  const audioContextRef = useRef(null);
  const frequencyRef = useRef(null);
  const notesRef = useRef(null)

  const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];


  useEffect(() => {
    const initAudio = async () => {

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      const gain = audioContext.createGain()
      gain.gain.value = 0.2;
      source.connect(gain)
      gain.connect(analyser)
      


      setInterval(() => {
        detectPitch(analyser);
        detectNote(frequencyRef.current);
      }, 1000
      );

    }

    initAudio();

  }, [])

  function detectPitch(analyser) {
    const audioContext = audioContextRef.current;
    const myDataArray = new Float32Array(analyser.fftSize);
    const detector = PitchDetector.forFloat32Array(analyser.fftSize)
    analyser.getFloatTimeDomainData(myDataArray);

    const [pitch, clarity] = detector.findPitch(myDataArray, audioContext.sampleRate)
    frequencyRef.current = pitch
  }


  function detectNote(frequency) {

    const A4 = 440;
    const octave = 4 + parseInt(Math.log2(frequency / A4));
    const semiTone = Math.round(12 * Math.log2(frequency / A4));
    const cents = 1200 * Math.log2(frequency / A4);
    let centsoff;
    if (semiTone < 0) {

      setNote(notes[(12 - Math.abs((semiTone % 12))) % 12])
      notesRef.current = semiTone;
      centsoff = getCentsOff(frequency, getCorrectFrequency(notesRef.current))
    } else {
      setNote(notes[semiTone % 12])
      notesRef.current = semiTone;
      centsoff = getCentsOff(frequency, getCorrectFrequency(notesRef.current))
    }

    setOctave(octave)
    setCentsoff(centsoff)
    console.log({
      asdffad: getCorrectFrequency(notesRef.current),
      asdf: notesRef.current,
      octave: octave,
      cents: centsoff
    })
  }

  function getCorrectFrequency(note) {
    return 440 * Math.pow(2, (note / 12));
  }

  function getCentsOff(actualFreq, correctFreq) {
    return 1200 * Math.log2(actualFreq / correctFreq);
  }
return (
  <div className="flex items-center justify-center">
    <div className="rounded-2xl p-10 w-[400px] flex flex-col items-center gap-6">
      <h1 className="text-white text-2xl font-bold mb-6">Tuner</h1>
      <div className="flex items-end gap-2">
        <span className="text-white text-7xl font-bold">{note ?? '-'}</span>
        <span className="text-gray-400 text-2xl">{octave ?? ''}</span>
      </div>

      <div className="w-full mt-4">
        <div className="relative w-full h-4 bg-gray-700 rounded-full overflow-hidden">

          {/* In-tune range marker (±5 cents around center) */}
          <div className="absolute left-1/2 top-0 h-full w-[12%] -translate-x-1/2 bg-green-700 bg-opacity-30 rounded-full z-0" />

          {/* Moving pitch indicator */}
          <div
            className="absolute top-[-6px] h-6 w-1 rounded bg-green-400 z-10 transition-all duration-150 ease-out"
            style={{
              left: `${Math.min(Math.max(50 + (centsoff ?? 0) * 1, 0), 100)}%`, // 1:1 mapping
              transform: 'translateX(-50%)'
            }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
          <span className='text-[20px] font-bold'>♭</span>
          <span>In Tune</span>
          <span className='text-lg'>#</span>
        </div>
      </div>
    </div>
  </div>
);


}

export default Tuner
