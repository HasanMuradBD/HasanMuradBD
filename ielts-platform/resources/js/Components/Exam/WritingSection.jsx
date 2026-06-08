import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CharacterCount from '@tiptap/extension-character-count';
import { useExamStore } from '@/store/examStore';

function WordMeter({ count, target }) {
    const pct   = Math.min((count / target) * 100, 100);
    const over  = count >= target;
    const near  = count >= target * 0.8;
    const bar   = over ? 'bg-green-500' : near ? 'bg-amber-400' : 'bg-red-500';
    const text  = over ? 'text-green-400' : near ? 'text-amber-400' : 'text-red-400';
    return (
        <div className="flex items-center gap-2 min-w-0">
            <div className="w-24 bg-gray-700 rounded-full h-1.5 flex-shrink-0">
                <div className={`${bar} h-1.5 rounded-full transition-all duration-300`} style={{ width: `${pct}%` }} />
            </div>
            <span className={`text-xs font-mono font-bold whitespace-nowrap ${text}`}>
                {count} / {target}+ words
            </span>
        </div>
    );
}

function TaskEditor({ prompt, taskKey, wordTarget, taskLabel, timeLabel }) {
    const { setWritingText, writingTexts } = useExamStore();

    const editor = useEditor({
        extensions: [StarterKit, CharacterCount],
        content: writingTexts[taskKey] ?? '',
        onUpdate({ editor }) {
            setWritingText(taskKey, editor.getText());
        },
        editorProps: {
            attributes: {
                class: 'min-h-[280px] focus:outline-none text-gray-200 text-sm leading-7 p-5',
            },
        },
    });

    const wordCount = editor?.storage.characterCount.words() ?? 0;

    return (
        <div className="h-full flex flex-col min-h-0 overflow-hidden">
            {/* Prompt */}
            <div className="flex-shrink-0 bg-gray-800 border border-gray-700 rounded-xl p-5 mb-3">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-300 bg-indigo-600/25 border border-indigo-600/40 px-2.5 py-0.5 rounded-full">
                            {taskLabel}
                        </span>
                        <span className="text-xs text-gray-500">{timeLabel}</span>
                    </div>
                    <span className="text-xs text-gray-500">Min. {wordTarget} words</span>
                </div>
                {prompt ? (
                    <p className="text-gray-300 text-sm leading-relaxed">{prompt.prompt_text}</p>
                ) : (
                    <p className="text-gray-500 text-sm italic">No prompt loaded for this task.</p>
                )}
                {prompt?.data_description && (
                    <div className="mt-3 bg-gray-900/60 border border-gray-600 rounded-lg p-3">
                        <p className="text-xs text-gray-400 italic">{prompt.data_description}</p>
                    </div>
                )}
            </div>

            {/* Editor */}
            <div className="flex-1 flex flex-col bg-gray-800 border border-gray-700 rounded-xl overflow-hidden min-h-0">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-700 bg-gray-800/80 flex-shrink-0 gap-4">
                    <div className="flex items-center gap-1">
                        <button onClick={() => editor?.chain().focus().toggleBold().run()}
                            className={`w-7 h-7 text-xs font-bold rounded flex items-center justify-center transition ${editor?.isActive('bold') ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}>
                            B
                        </button>
                        <button onClick={() => editor?.chain().focus().toggleItalic().run()}
                            className={`w-7 h-7 text-xs italic rounded flex items-center justify-center transition ${editor?.isActive('italic') ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}>
                            I
                        </button>
                    </div>
                    <WordMeter count={wordCount} target={wordTarget} />
                </div>
                <div className="flex-1 overflow-y-auto">
                    <EditorContent editor={editor} className="h-full" />
                </div>
            </div>
        </div>
    );
}

export default function WritingSection({ test }) {
    const [activeTask, setActiveTask] = useState(0);
    const { writingTexts } = useExamStore();

    const prompts = test.writing_prompts ?? [];
    const task1   = prompts.find(p => p.task_number === 'task_1') ?? null;
    const task2   = prompts.find(p => p.task_number === 'task_2') ?? null;

    const tasks = [
        task1 && { key: 'writing_task_1', label: 'Task 1', timeLabel: '≈ 20 min', wordTarget: 150, prompt: task1 },
        task2 && { key: 'writing_task_2', label: 'Task 2', timeLabel: '≈ 40 min', wordTarget: 250, prompt: task2 },
    ].filter(Boolean);

    const wordCount = (taskKey) => {
        const t = writingTexts[taskKey] ?? '';
        return t.trim() ? t.trim().split(/\s+/).length : 0;
    };

    if (tasks.length === 0) {
        return (
            <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                    <p className="text-4xl mb-3">✏️</p>
                    <p className="font-medium">No writing prompts available for this test.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Task tabs — only show if multiple tasks */}
            {tasks.length > 1 && (
                <div className="flex-shrink-0 flex border-b border-gray-700 bg-gray-800/60 px-4 pt-2 gap-1">
                    {tasks.map((task, i) => {
                        const wc   = wordCount(task.key);
                        const done = wc >= task.wordTarget;
                        return (
                            <button key={task.key} onClick={() => setActiveTask(i)}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition ${activeTask === i ? 'border-indigo-400 text-white bg-gray-800' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>
                                {task.label}
                                <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${done ? 'bg-green-700/40 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                                    {wc}w
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}

            <div className="flex-1 overflow-hidden p-5 min-h-0">
                <TaskEditor
                    key={tasks[activeTask]?.key}
                    prompt={tasks[activeTask]?.prompt}
                    taskKey={tasks[activeTask]?.key}
                    wordTarget={tasks[activeTask]?.wordTarget}
                    taskLabel={tasks[activeTask]?.label}
                    timeLabel={tasks[activeTask]?.timeLabel}
                />
            </div>
        </div>
    );
}
