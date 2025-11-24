'use client';

import { useEdit } from '@/context/EditContext';
import EditableText from '@/components/EditableText';
import SpotlightCard from '@/components/ui/SpotlightCard';
import MotionWrapper from '@/components/ui/MotionWrapper';
import * as Icons from 'lucide-react';

export default function Skills() {
    const { content } = useEdit();
    const { skills } = content;

    return (
        <div className="space-y-16 text-white">
            <MotionWrapper>
                <h2 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    Technical Skills
                </h2>
            </MotionWrapper>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {skills.map((skill: any, index: number) => {
                    // @ts-ignore
                    const Icon = Icons[skill.icon] || Icons.Code;

                    return (
                        <MotionWrapper key={index} delay={index * 0.1}>
                            <SpotlightCard className="h-full">
                                <div className="flex flex-col items-center justify-center p-8 h-full group">
                                    <div className="p-4 bg-gray-800/50 rounded-full mb-4 group-hover:scale-110 transition duration-300 border border-gray-700 group-hover:border-blue-500/50">
                                        <Icon size={32} className="text-gray-300 group-hover:text-blue-400 transition" />
                                    </div>
                                    <EditableText
                                        section="skills"
                                        index={index}
                                        field="name"
                                        as="span"
                                        className="text-lg font-medium text-gray-200"
                                    />
                                    <div className="text-xs text-gray-600 mt-2 opacity-0 group-hover:opacity-100 transition absolute bottom-2">
                                        <EditableText section="skills" index={index} field="icon" as="span" />
                                    </div>
                                </div>
                            </SpotlightCard>
                        </MotionWrapper>
                    );
                })}
            </div>
        </div>
    );
}
