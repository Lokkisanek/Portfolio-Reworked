'use client';

import { useEdit } from '@/context/EditContext';
import EditableText from '@/components/EditableText';
import SpotlightCard from '@/components/ui/SpotlightCard';
import MotionWrapper from '@/components/ui/MotionWrapper';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export default function Projects() {
    const { content } = useEdit();
    const { projects } = content;

    return (
        <div className="space-y-16 text-white">
            <MotionWrapper>
                <h2 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    Featured Projects
                </h2>
            </MotionWrapper>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project: any, index: number) => (
                    <MotionWrapper key={index} delay={index * 0.1}>
                        <SpotlightCard className="h-full flex flex-col">
                            <div className="h-56 bg-gray-800/50 flex items-center justify-center text-gray-600 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
                                <span className="z-10 font-mono text-sm border border-gray-700 px-3 py-1 rounded bg-black/30 backdrop-blur-sm">
                                    <EditableText section="projects" index={index} field="image" as="span" />
                                </span>
                            </div>

                            <div className="p-8 flex flex-col flex-grow">
                                <EditableText
                                    section="projects"
                                    index={index}
                                    field="title"
                                    as="h3"
                                    className="text-2xl font-bold mb-3 text-white group-hover:text-blue-400 transition"
                                />
                                <EditableText
                                    section="projects"
                                    index={index}
                                    field="description"
                                    as="p"
                                    className="text-gray-400 mb-6 leading-relaxed flex-grow"
                                />

                                <div className="flex justify-between items-center mt-auto pt-6 border-t border-gray-800">
                                    <Link href={project.link} className="flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition group/link">
                                        View Project <ExternalLink size={14} className="group-hover/link:translate-x-1 transition" />
                                    </Link>
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
