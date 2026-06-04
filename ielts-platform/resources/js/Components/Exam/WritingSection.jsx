import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CharacterCount from '@tiptap/extension-character-count';
import { useExamStore } from '@/store/examStore';

function WritingTask({ prompt, taskKey, wordTarget, timeLabel }) {
    const { setAnswer, answers } = useExamStore();

    const editor = useEditor({
        extensions: [
            StarterKit,
            CharacterCount,
        ],
        content: answers[taskKey] ?? '',
        onUpdate({ editor }) {
            setAnswer(taskKey, editor.getText());
        },
        editorProps: {
            attributes: {
                class: 'min-h-64 focus:outline-none text-gray-200 text-sm leading-7 p-4',
            },
        },
    });

    const wordCount = editor?.storage.characterCount.words() ?? 0;
    const isUnder = wordCount < wordTarget;

    return (
        <div className="flex flex-col h-full">
            {/* Prompt */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 mb-4">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{taskKey.replace('_', ' ')}</span>
                    <span className="text-xs text-gray-500">{timeLabel}</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{prompt?.prompt_text ?? 'Writing prompt loading...'}</p>
                {prompt?.data_description && (
                    <div className="mt-3 p-3 bg-gray-900 rounded-lg border border-gray-600">
                        <p className="text-xs text-gray-400 italic">{prompt.data_description}</p>
                    </div>
                )}
            </div>

            {/* Editor */}
            <div className="flex-1 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex flex-col">
                <div className="border-b border-gray-700 px-4 py-2 flex items-center justify-between bg-gray-750">
                    <div className="flex gap-2">
                        <button onClick={() => editor?.chain().focus().toggleBold().run()}
                            className={`text-xs px-2 py-1 rounded ${editor?.isActive('bold') ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                            B
                        </button>
                        <button onClick={() => editor?.chain().focus().toggleItalic().run()}
                            className={`text-xs px-2 py-1 rounded italic ${editor?.isActive('italic') ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                            I
                        </button>
                    </div>
                    <div className={`text-xs font-mono font-bold ${isUnder ? 'text-red-400' : 'text-green-400'}`}>
                        {wordCount} / {wordTarget}+ words
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <EditorContent editor={editor} className="h-full" />
                </div>
            </div>
        </div>
    );
}

export default function WritingSection({ test }) {
    const prompts = test.writing_prompts ?? [];
    const task1 = prompts.find(p => p.task_number === 'task_1');
    const task2 = prompts.find(p => p.task_number === 'task_2');

    return (
        <div className="h-full flex overflow-hidden">
            <div className="w-1/2 h-full flex flex-col p-5 border-r border-gray-700">
                <WritingTask prompt={task1} taskKey="writing_task_1" wordTarget={150} timeLabel="Suggested: 20 minutes" />
            </div>
            <div className="w-1/2 h-full flex flex-col p-5">
                <WritingTask prompt={task2} taskKey="writing_task_2" wordTarget={250} timeLabel="Suggested: 40 minutes" />
            </div>
        </div>
    );
}
