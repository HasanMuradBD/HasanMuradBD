import { useState, useRef } from 'react';
import { useExamStore } from '@/store/examStore';

function SpeakingPart({ prompt, partKey, timeSeconds }) {
    const { setAnswer } = useExamStore();
    const [recording, setRecording] = useState(false);
    const [recordingDone, setRecordingDone] = useState(false);
    const [timeLeft, setTimeLeft] = useState(timeSeconds);
    const timerRef = useRef(null);
    const mediaRef = useRef(null);
    const chunksRef = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            mediaRef.current = recorder;
            chunksRef.current = [];

            recorder.ondataavailable = e => chunksRef.current.push(e.data);
            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAnswer(partKey, `[recording:${partKey}]`); // Mark as answered
                stream.getTracks().forEach(t => t.stop());
                setRecordingDone(true);
                setRecording(false);
            };

            recorder.start();
            setRecording(true);

            // Countdown
            let remaining = timeSeconds;
            timerRef.current = setInterval(() => {
                remaining -= 1;
                setTimeLeft(remaining);
                if (remaining <= 0) {
                    clearInterval(timerRef.current);
                    recorder.stop();
                }
            }, 1000);
        } catch {
            setAnswer(partKey, '[microphone_unavailable]');
        }
    };

    const stopRecording = () => {
        clearInterval(timerRef.current);
        mediaRef.current?.stop();
    };

    const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

    return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 mb-4">
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                    {partKey.replace('_', ' ')}
                </span>
                <span className="text-xs text-gray-500 font-mono">{fmt(timeLeft)}</span>
            </div>

            {prompt?.cue_card_notes && (
                <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4 mb-4">
                    <p className="text-yellow-200 text-sm font-medium mb-2">{prompt.topic}</p>
                    <pre className="text-yellow-100/80 text-xs leading-5 whitespace-pre-wrap font-sans">{prompt.cue_card_notes}</pre>
                </div>
            )}

            {prompt?.follow_up_questions && (
                <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-2">Questions to address:</p>
                    <ul className="space-y-1.5">
                        {prompt.follow_up_questions.map((q, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                <span className="text-indigo-400 flex-shrink-0">{i + 1}.</span>
                                {q}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="flex items-center gap-3">
                {!recording && !recordingDone && (
                    <button onClick={startRecording}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition">
                        <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
                        Record Answer
                    </button>
                )}
                {recording && (
                    <>
                        <div className="flex items-center gap-2 text-red-400 text-sm font-medium animate-pulse">
                            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                            Recording...
                        </div>
                        <button onClick={stopRecording}
                            className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-lg transition">
                            Stop
                        </button>
                    </>
                )}
                {recordingDone && (
                    <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                        <span>✓</span> Recording saved
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SpeakingSection({ test }) {
    const prompts = test.speaking_prompts ?? [];

    return (
        <div className="h-full overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto">
                <div className="bg-indigo-900/30 border border-indigo-700 rounded-xl p-4 mb-6 text-sm text-indigo-200">
                    <p className="font-medium mb-1">🎙 Speaking Module</p>
                    <p className="text-indigo-300 text-xs">
                        Record your response for each part. Part 1: general questions (4–5 min).
                        Part 2: 2-minute individual talk. Part 3: discussion (4–5 min).
                    </p>
                </div>

                {prompts.map(p => (
                    <SpeakingPart
                        key={p.id}
                        prompt={p}
                        partKey={p.part_number}
                        timeSeconds={p.time_allowed_seconds ?? 120}
                    />
                ))}

                {prompts.length === 0 && (
                    <div className="text-center text-gray-500 py-16">
                        <p>No speaking prompts available for this test.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
