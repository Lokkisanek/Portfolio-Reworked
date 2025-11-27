'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { updateContent } from '@/app/actions';

type Content = any;

type BackgroundType = 'starfield' | 'flowing-gradient' | 'colorbends';

interface EditContextType {
    isEditing: boolean;
    isAuthenticated: boolean;
    content: Content;
    backgroundType: BackgroundType;
    toggleEdit: () => void;
    login: (password: string) => boolean;
    updateField: (section: string, field: string, value: string) => void;
    updateArrayItem: (section: string, index: number, field: string, value: any) => void;
    addArrayItem: (section: string, item: any) => void;
    removeArrayItem: (section: string, index: number) => void;
    setBackgroundType: (type: BackgroundType) => void;
    gradientSettings: { colors: string[]; speed: number; mouseInfluence: number };
    updateGradientSettings: (settings: { colors: string[]; speed: number; mouseInfluence: number }) => void;
}

const EditContext = createContext<EditContextType | undefined>(undefined);

export function EditProvider({ children, initialContent }: { children: ReactNode; initialContent: Content }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [content, setContent] = useState(initialContent);
    const [backgroundType, setBackgroundTypeState] = useState<BackgroundType>(
        (initialContent?.backgroundType as BackgroundType) || 'starfield'
    );
    const [gradientSettings, setGradientSettingsState] = useState(
        initialContent?.gradientSettings || {
            colors: ['#ff0000', '#00ff00', '#0000ff'],
            speed: 1,
            mouseInfluence: 0
        }
    );
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Debounced auto-save
    useEffect(() => {
        if (hasUnsavedChanges) {
            const timer = setTimeout(async () => {
                console.log('Auto-saving...');
                await updateContent(content);
                setHasUnsavedChanges(false);
                console.log('Saved!');
            }, 1000); // Save 1 second after last change

            return () => clearTimeout(timer);
        }
    }, [content, hasUnsavedChanges]);

    const login = (password: string) => {
        if (password === 'admin123') {
            setIsAuthenticated(true);
            setIsEditing(true);
            return true;
        }
        return false;
    };

    const toggleEdit = () => {
        if (isAuthenticated) {
            setIsEditing(!isEditing);
        }
    };

    const updateField = useCallback((section: string, field: string, value: string) => {
        setContent((prev: any) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
        setHasUnsavedChanges(true);
    }, []);

    const updateArrayItem = useCallback((section: string, index: number, field: string, value: any) => {
        setContent((prev: any) => {
            const newArray = [...prev[section]];
            newArray[index] = { ...newArray[index], [field]: value };
            return { ...prev, [section]: newArray };
        });
        setHasUnsavedChanges(true);
    }, []);

    const addArrayItem = useCallback((section: string, item: any) => {
        setContent((prev: any) => {
            const newArray = Array.isArray(prev[section]) ? [...prev[section]] : [];
            newArray.push(item);
            return { ...prev, [section]: newArray };
        });
        setHasUnsavedChanges(true);
    }, []);

    const removeArrayItem = useCallback((section: string, index: number) => {
        setContent((prev: any) => {
            const newArray = Array.isArray(prev[section]) ? [...prev[section]] : [];
            newArray.splice(index, 1);
            return { ...prev, [section]: newArray };
        });
        setHasUnsavedChanges(true);
    }, []);

    const setBackgroundType = useCallback((type: BackgroundType) => {
        setBackgroundTypeState(type);
        setContent((prev: any) => ({
            ...prev,
            backgroundType: type
        }));
        setHasUnsavedChanges(true);
    }, []);

    const updateGradientSettings = useCallback((settings: { colors: string[]; speed: number; mouseInfluence: number }) => {
        setGradientSettingsState(settings);
        setContent((prev: any) => ({
            ...prev,
            gradientSettings: settings
        }));
        setHasUnsavedChanges(true);
    }, []);

    return (
        <EditContext.Provider value={{
            isEditing,
            isAuthenticated,
            content,
            backgroundType,
            toggleEdit,
            login,
            updateField,
            updateArrayItem,
            addArrayItem,
            removeArrayItem,
            setBackgroundType,
            gradientSettings,
            updateGradientSettings
        }}>
            {children}
        </EditContext.Provider>
    );
}

export function useEdit() {
    const context = useContext(EditContext);
    if (context === undefined) {
        throw new Error('useEdit must be used within an EditProvider');
    }
    return context;
}
