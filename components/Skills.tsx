'use client';

import { useEdit } from '@/context/EditContext';
import EditableText from '@/components/EditableText';
import SpotlightCard from '@/components/ui/SpotlightCard';
import MotionWrapper from '@/components/ui/MotionWrapper';
import * as Icons from 'lucide-react';
import TechIcons from '@/components/icons/TechIcons';
import { IconType } from 'react-icons';

export default function Skills() {
    const { content } = useEdit();
    const { skills } = content;

    // friendly proficiency mapping (1-5) if not specified in data
    const proficiencyMap: Record<string, number> = {
        HTML5: 5,
        CSS3: 5,
        JavaScript: 5,
        React: 5,
        Nodejs: 4,
        'Node.js': 4,
        Node: 4,
        Laravel: 3,
        Bootstrap: 4,
        Canva: 3
    };

    const brandColors: Record<string, string> = {
        Html5: '#E34F26',
        HTML5: '#E34F26',
        Css3: '#1572B6',
        CSS3: '#1572B6',
        Javascript: '#F7DF1E',
        JavaScript: '#F7DF1E',
        React: '#61DAFB',
        Nodejs: '#339933',
        'Node.js': '#339933',
        Node: '#339933',
        Canva: '#00C4CC',
        Laravel: '#FF2D20',
        Bootstrap: '#7952B3'
    };

    return (
        <div className="space-y-10 text-white">
            <MotionWrapper>
                <h2 className="text-4xl font-bold text-center text-white">
                    Technical Skills
                </h2>
            </MotionWrapper>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {skills.map((skill: any, index: number) => {
                    const key = (skill.icon || skill.name || index).toString();
                    const Custom: IconType | undefined =
                        TechIcons[skill.icon] || TechIcons[skill.name];
                    // @ts-ignore
                    const Lucide = Icons[skill.icon] || Icons.Code;
                    const level = skill.level ?? proficiencyMap[skill.name] ?? proficiencyMap[skill.icon] ?? 3;

                    return (
                        <MotionWrapper key={key} delay={index * 0.06}>
                            <SpotlightCard className="h-full group hover:scale-[1.02] transition-transform duration-300">
                                <div className="flex flex-col items-center justify-center p-8 h-full relative">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-b from-white/6 to-white/3 border border-white/6 flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
                                            {Custom ? (
                                                <Custom
                                                    size={46}
                                                    color={brandColors[skill.icon] || brandColors[skill.name] || '#F8FAFC'}
                                                    aria-hidden
                                                />
                                            ) : (
                                                // @ts-ignore
                                                <Lucide size={36} className="text-gray-200" />
                                            )}
                                        </div>
                                        <div className="absolute -right-2 -top-2 bg-black/60 text-xs text-white px-2 py-1 rounded-md border border-white/6 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Proficiency: {level}/5
                                        </div>
                                    </div>

                                    <div className="mt-4 text-lg font-semibold text-gray-100">
                                        <EditableText section="skills" index={index} field="name" as="span" className="" />
                                    </div>

                                    <div className="mt-3 flex items-center gap-2">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <span
                                                key={i}
                                                className={`inline-block w-2 h-2 rounded-full ${i < level ? 'bg-blue-400' : 'bg-white/8'}`}
                                            />
                                        ))}
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
