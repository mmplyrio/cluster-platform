'use server';

import { cookies } from 'next/headers';

function getApiUrl(): string {
    const url = process.env.INTERNAL_API_URL;
    return url || 'http://localhost:4000/api';
}

export async function getConversationsAction() {
    const token = (await cookies()).get('session')?.value;
    if (!token) return [];

    try {
        const res = await fetch(`${getApiUrl()}/chat/conversations`, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store'
        });
        const json = await res.json();
        return json.success ? json.data : [];
    } catch (error) {
        console.error('getConversationsAction error', error);
        return [];
    }
}

export async function getMessagesAction(conversationId: string) {
    const token = (await cookies()).get('session')?.value;
    if (!token) return [];

    try {
        const res = await fetch(`${getApiUrl()}/chat/conversations/${conversationId}/messages`, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store'
        });
        const json = await res.json();
        return json.success ? json.data : [];
    } catch (error) {
        console.error('getMessagesAction error', error);
        return [];
    }
}

export async function sendMessageAction(conversationId: string, content: string) {
    const token = (await cookies()).get('session')?.value;
    if (!token) return null;

    try {
        const res = await fetch(`${getApiUrl()}/chat/messages`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ conversationId, content })
        });
        const json = await res.json();
        return json.success ? json.data : null;
    } catch (error) {
        console.error('sendMessageAction error', error);
        return null;
    }
}

export async function getChatOverviewAction() {
    const token = (await cookies()).get('session')?.value;
    if (!token) return null;

    try {
        const res = await fetch(`${getApiUrl()}/chat/overview`, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store'
        });
        const json = await res.json();
        return json.success ? json.data : null;
    } catch (error) {
        console.error('getChatOverviewAction error', error);
        return null;
    }
}

export async function getRadarDataAction() {
    const token = (await cookies()).get('session')?.value;
    if (!token) return [];

    try {
        const res = await fetch(`${getApiUrl()}/chat/radar`, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store'
        });
        const json = await res.json();
        return json.success ? json.data : [];
    } catch (error) {
        console.error('getRadarDataAction error', error);
        return [];
    }
}
