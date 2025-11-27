'use client';

import { useEdit } from '@/context/EditContext';
import EditableText from '@/components/EditableText';
import SpotlightCard from '@/components/ui/SpotlightCard';
import MotionWrapper from '@/components/ui/MotionWrapper';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export default function Projects() {
    const { content, isEditing, addArrayItem, removeArrayItem, updateArrayItem } = useEdit();
    const { projects } = content;

    const handleAdd = () => {
        addArrayItem('projects', {
            title: 'New Project',
            description: 'Edit project description...',
            image: '/project-placeholder.png',
            link: '#',
            embed: false
        });
    };

    const uploadImage = async (file: File, index: number) => {
        try {
            const form = new FormData();
            form.append('file', file as any);
            const res = await fetch('/api/uploads', { method: 'POST', body: form });
            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();
            updateArrayItem('projects', index, 'image', data.path);
        } catch (err) {
            console.error('Upload failed', err);
            alert('Image upload failed');
        }
    };

    const deleteImage = async (imgPath: string, index: number) => {
        try {
            if (!imgPath) return;
            const res = await fetch('/api/uploads', { method: 'DELETE', body: JSON.stringify({ path: imgPath }), headers: { 'Content-Type': 'application/json' } });
            if (res.status !== 204) console.warn('Delete returned', await res.text());
            updateArrayItem('projects', index, 'image', '');
        } catch (err) {
            console.error('Delete failed', err);
            alert('Image delete failed');
        }
    };

    return (
        <div className="space-y-12 text-white px-4 sm:px-6 lg:px-0">
            <MotionWrapper>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-white">
                    Featured Projects
                </h2>
            </MotionWrapper>

            <div className="flex items-center justify-end">
                {isEditing && (
                    <button type="button" onClick={handleAdd} className="mb-4 bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded text-sm sm:text-base">Add Project</button>
                )}
            </div>

            {isEditing && projects && projects.length > 0 && (
                <div className="mb-6 p-3 sm:p-4 bg-black/40 rounded border border-white/5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                        <div className="text-sm text-gray-300">Project manager (edit mode)</div>
                        <div className="text-xs text-gray-400">You can delete projects or images here</div>
                    </div>
                    <div className="space-y-2">
                        {projects.map((p: any, i: number) => (
                            <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div className="flex-1 text-sm text-gray-200">{i + 1}. {p.title || 'Untitled'}</div>
                                <div className="flex items-center gap-2">
                                    {p.image && (
                                        <button type="button" onClick={async () => {
                                            if (!confirm('Delete image for this project?')) return;
                                            await deleteImage(p.image, i);
                                        }} className="bg-yellow-600 hover:bg-yellow-500 text-white text-sm px-3 py-1 rounded">Delete Image</button>
                                    )}
                                    <button type="button" onClick={() => {
                                        if (!confirm('Delete this project?')) return;
                                        removeArrayItem('projects', i);
                                    }} className="bg-red-600 hover:bg-red-500 text-white text-sm px-3 py-1 rounded">Delete Project</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {projects.map((project: any, index: number) => (
                    <MotionWrapper key={index} delay={index * 0.1}>
                        <SpotlightCard className="h-full flex flex-col">
                            {project.embed ? (
                                <div className="w-full relative rounded-t overflow-hidden" style={{ paddingTop: '56.25%' }}>
                                    <iframe
                                        src={project.link}
                                        title={project.title}
                                        className="absolute inset-0 w-full h-full border-0"
                                        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                                    />
                                </div>
                            ) : project.image ? (
                                <div className="w-full relative rounded-t overflow-hidden" style={{ paddingTop: '56.25%' }}>
                                    <img src={project.image} alt={`${project.title} image`} className="absolute inset-0 w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="w-full relative rounded-t overflow-hidden" style={{ paddingTop: '56.25%' }}>
                                    <div className="absolute inset-0 bg-gray-800/50 flex items-center justify-center text-gray-600 group">
                                        <span className="z-10 font-mono text-sm border border-gray-700 px-3 py-1 rounded bg-black/30 backdrop-blur-sm">
                                            <EditableText section="projects" index={index} field="image" as="span" />
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="p-8 flex flex-col flex-grow">
                                {isEditing && (
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-3">
                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={!!project.embed}
                                                onChange={(e) => updateArrayItem('projects', index, 'embed', !!e.target.checked)}
                                            />
                                            <span className="ml-1">Embed (iframe)</span>
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                                                <span className="bg-white/5 hover:bg-white/10 text-white px-3 py-1 rounded">Upload Image</span>
                                                <input
                                                    className="sr-only"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const f = e.target.files?.[0];
                                                        if (f) uploadImage(f, index);
                                                    }}
                                                />
                                            </label>
                                            {project.image && (
                                                <button type="button" onClick={() => deleteImage(project.image, index)} className="text-sm text-yellow-300 hover:text-yellow-200">Delete Image</button>
                                            )}
                                            <button type="button" onClick={() => removeArrayItem('projects', index)} className="text-sm text-red-400 hover:text-red-300">Remove</button>
                                        </div>
                                    </div>
                                )}

                                <EditableText
                                    section="projects"
                                    index={index}
                                    field="title"
                                    as="h3"
                                    className="text-2xl font-bold mb-3 text-white transition"
                                />
                                <EditableText
                                    section="projects"
                                    index={index}
                                    field="description"
                                    as="p"
                                    className="text-gray-400 mb-6 leading-relaxed flex-grow"
                                />

                                <div className="flex justify-between items-center mt-auto pt-6 border-t border-gray-800">
                                    {project.link?.startsWith('http') ? (
                                    <a href={project.link} target={project.embed ? '_blank' : undefined} rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition group/link sm:whitespace-nowrap">
                                        <span className="">View Project</span>
                                        <ExternalLink size={14} className="ml-1 inline-block group-hover/link:translate-x-1 transition" />
                                    </a>
                                ) : (
                                    <Link href={project.link} className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition group/link sm:whitespace-nowrap">
                                        <span className="">View Project</span>
                                        <ExternalLink size={14} className="ml-1 inline-block group-hover/link:translate-x-1 transition" />
                                    </Link>
                                )}
                                    <div className="text-xs text-gray-600 opacity-0 group-hover:opacity-100">
                                        <EditableText section="projects" index={index} field="link" as="span" />
                                    </div>
                                </div>
                            </div>
                        </SpotlightCard>
                    </MotionWrapper>
                ))}
            </div>
        </div>
    );
}
