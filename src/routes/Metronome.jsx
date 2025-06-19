import React, {useState, useEffect, useRef} from 'react'
import Play from '/play.svg'
import Pause from '/pause.svg'
import { ChevronRight, ChevronLeft} from 'lucide-react'

function Metronome() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [tempo, setTempo] = useState(100);
    const [beatPosition, setBeatPosition] = useState(1);

    const tempoRef = useRef(100);
    const audioContextRef = useRef(null);
    const timerIdRef = useRef(null);
    const nextNoteTimeRef = useRef(0);
    const beatRef = useRef(1);

    const lookahead = 25.0;
    const scheduleAheadTime = 0.1;

    useEffect(() => {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        return () => {
            stopMetronome();
            if (audioContextRef.current) audioContextRef.current.close();
        };
    }, []);

    useEffect(() => {
        tempoRef.current = tempo;
    }, [tempo]);

    const playClick = (time) => {
        const ctx = audioContextRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const beat = beatRef.current;

        osc.frequency.value = beat === 1 ? 1000 : 800;
        gain.gain.setValueAtTime(0.5, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 0.1);

        setBeatPosition(beat);
        beatRef.current = beat % 4 + 1;
    };

    const scheduler = () => {
        const ctx = audioContextRef.current;
        while (nextNoteTimeRef.current < ctx.currentTime + scheduleAheadTime) {
            playClick(nextNoteTimeRef.current);
            const secondsPerBeat = 60.0 / tempoRef.current;
            nextNoteTimeRef.current += secondsPerBeat;
        }
    };

    const startMetronome = () => {
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        nextNoteTimeRef.current = ctx.currentTime + 0.05;
        beatRef.current = 1;
        timerIdRef.current = setInterval(scheduler, lookahead);
        setIsPlaying(true);
    };

    const stopMetronome = () => {
        if (timerIdRef.current) clearInterval(timerIdRef.current);
        setIsPlaying(false);
        setBeatPosition(0)
    };

    const toggleMetronome = () => {
        isPlaying ? stopMetronome() : startMetronome();
    };

    const TempoIncrement = () =>{
        setTempo(tempo + 1);
    }

      const TempoDecrement = () =>{
        setTempo(tempo - 1);
    }

    return (

        <div className="text-center p-8 font-sans text-[#F9F7F7] flex-col">
            <h1 className="text-2xl font-bold mb-6">Metronome</h1>

            <div className="relative h-20 w-full max-w-lg mx-auto bg-gray-100  my-10 flex items-center justify-between p-5 rounded-2xl">
                <div className={`bg-gray-300 h-10 w-10 rounded-full ${beatPosition === 1 ? 'bg-gray-500' : 'bg-gray-300'} transition-all`}></div>
                <div className={`bg-gray-300 h-10 w-10 rounded-full ${beatPosition === 2 ? 'bg-gray-500' : 'bg-gray-300'} transition-all`}></div>
                <div className={`bg-gray-300 h-10 w-10 rounded-full ${beatPosition === 3 ? 'bg-gray-500' : 'bg-gray-300'} transition-all`}></div>
                <div className={`bg-gray-300 h-10 w-10 rounded-full ${beatPosition === 4 ? 'bg-gray-500' : 'bg-gray-300'} transition-all`}></div>


            </div>
             <div className="block m-5">
                   <div className='text-2xl font-bold'>Tempo</div><div className="font-semibold text-6xl flex justify-center m-5 items-center gap-10"><ChevronLeft className='h-10 w-10 hover:scale-125 transition-all text-[#669bbc]' onClick={TempoDecrement}/>{tempo}<ChevronRight className='h-10 w-10 hover:scale-125 transition-all text-[#669bbc]' onClick={TempoIncrement}/></div><div>BPM</div>
                </div>
            <button
                onClick={toggleMetronome}
                className="px-3 py-3 text-white text-lg font-semibold rounded-full backdrop-opacity-80 hover:scale-110 transition-all " 
            >
                 {isPlaying ? <img src={Pause} className='h-10 w-10 ' /> : <img src={Play} className='h-10 w-10 text-[#222831]' />}
            </button>

            <div className="mt-6 max-w-md mx-auto">
               
                <input
                    type="range"
                    min="40"
                    max="240"
                    value={tempo}
                    onChange={(e) => setTempo(Number(e.target.value))}
                    className="range range-md "
                />
            </div>
        </div>
    );

}

export default Metronome
