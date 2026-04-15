import { LayoutDashboard, Users, User, Map, BookOpen, Calendar, MessageSquare, Blocks, Mail, Settings, LucideIcon } from 'lucide-react';

export type NavItem = {
    title: string;
    url: string;
    icon: LucideIcon;
};

export const mentorMenu: NavItem[] = [
    { title: 'Visão Geral', url: '/mentor', icon: LayoutDashboard },
    { title: 'Gestão de Turmas', url: '/mentor/turmas', icon: Users },
    { title: 'Meus Alunos', url: '/mentor/alunos', icon: User },
    { title: 'Comunicação', url: '/mentor/comunicacao', icon: MessageSquare },
    { title: 'Builder de Mentoria', url: '/mentor/builder', icon: Blocks },
];

export const menteeMenu: NavItem[] = [
    { title: 'Minha Trilha', url: '/mentee', icon: Map },
    { title: 'Materiais', url: '/mentee/materiais', icon: BookOpen },
    { title: 'Agendamentos', url: '/mentee/agendamentos', icon: Calendar },
];