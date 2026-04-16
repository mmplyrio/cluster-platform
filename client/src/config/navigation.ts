import { LayoutDashboard, Users, User, Map, BookOpen, Calendar, MessageSquare, Blocks, Mail, Settings, LucideIcon, MapPin, ListTodo } from 'lucide-react';

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
    { title: 'Visão Geral', url: '/mentee', icon: LayoutDashboard },
    { title: 'A Jornada', url: '/mentee/trilha', icon: MapPin },
    { title: 'Plano de Ação', url: '/mentee/plano-de-acao', icon: ListTodo },
    { title: 'Comunicação', url: '/mentee/comunicacao', icon: MessageSquare },
    { title: 'Configurações', url: '/mentee/configuracoes', icon: Settings },
];